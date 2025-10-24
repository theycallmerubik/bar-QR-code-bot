const TelegramBot = require('node-telegram-bot-api');
const bwipjs    =    require('bwip-js');
const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const TOKEN = process.env.TELEGRAM_TOKEN;
const PORT = process.env.PORT || 3000;
const webhookurl = process.env.WEBHOOK_URL;

const app = express();
const bot = new TelegramBot(TOKEN);

bot.setWebHook(`${webhookurl}/bot${TOKEN}`);

app.use(express.json());

app.post(`/bot${TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

app.get('/bot', (req, res) => {
  res.send('Bot is running!');
});

app.listen(PORT, () => {
  console.log(`Bot is live on port ${PORT}`);
});

const userChoices = {};
const inputMessages = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Generate QR Code🔠', callback_data: 'qr' }],
        [{ text: 'Generate Barcode⏸', callback_data: 'barcode' }],
      ],
    },
  };

  bot.sendMessage(chatId, 'What would you like to generate?', options);
});

bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;
  const userId = callbackQuery.from.id;
  const choice = callbackQuery.data;

  if (choice === 'return') {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Generate QR Code🔠', callback_data: 'qr' }],
          [{ text: 'Generate Barcode⏸', callback_data: 'barcode' }],
        ],
      },
    };
    await bot.editMessageText('What would you like to generate?', {
      chat_id: chatId,
      message_id: messageId,
      reply_markup: options.reply_markup,
    });
    return;
  }

  userChoices[userId] = choice;

  const promptMessage =
    choice === 'qr'
      ? 'Please send me the text you want to convert to a QR Code.'
      : 'Please send me the text you want to convert to a Barcode.';

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Return🔙', callback_data: 'return' }],
      ],
    },
  };

  const sentMessage = await bot.editMessageText(promptMessage, {
    chat_id: chatId,
    message_id: messageId,
    reply_markup: options.reply_markup,
  });
  inputMessages[userId] = sentMessage.message_id;
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  const choice = userChoices[userId];
  if (!choice) return;

  const inputMessageId = inputMessages[userId];
  if (inputMessageId) {
    try {
      await bot.deleteMessage(chatId, inputMessageId);
    } catch (err) {
      console.error('Failed to delete input message:', err);
    }
    delete inputMessages[userId];
  }

  if (choice === 'qr') {
    const qrCodePath = path.join(__dirname, `qrcode-${Date.now()}.png`);

    try {
      const dir = path.dirname(qrCodePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      console.log('Generating QR Code...');
      await QRCode.toFile(qrCodePath, text);
      console.log(`QR Code saved successfully at: ${qrCodePath}`);

      const filename = path.basename(qrCodePath);
      console.log(filename)

      if (fs.existsSync(qrCodePath)) {
        await bot.sendPhoto(chatId ,fs.createReadStream(qrCodePath) ,{ caption: 'Here is your QR Code!' });
      } else {
        console.error('File does not exist after creation:', qrCodePath);
        bot.sendMessage(chatId, 'Failed to generate QR Code. Please try again.');
      }
    } catch (err) {
      console.error('Error during QR Code process:', err);
      bot.sendMessage(chatId, 'Failed to generate or send QR Code. Please try again.');
    } finally {
      if (fs.existsSync(qrCodePath)) {
        fs.unlinkSync(qrCodePath);
        console.log('Successfully cleared the QR')
      }
    }
  } else if (choice === 'barcode') {
    const barcodePath = path.join(__dirname, `barcode-${Date.now()}.png`);
    try {
      const dir = path.dirname(barcodePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      console.log('Generating BarCode...');
      try {
        await new Promise((resolve, reject) => {
          bwipjs.toBuffer(
            {
              bcid: 'code128',
              text: text,
              scale: 3,
              height: 10,
            },
            (err, png) => {
              if (err) {
                console.error('Barcode generation error:', err);
                return reject(err);
              }
              fs.writeFileSync(barcodePath, png);
              console.log('BarCode Generated...');
              resolve();
            }
          );
        });
      } catch (error) {
        console.error('Error during barcode generation:', error);
        throw error;
      }      
      console.log(`BarCode saved successfully at: ${barcodePath}`);

      if (fs.existsSync(barcodePath)) {
        console.log('File verified. Sending barcode...');
        await bot.sendPhoto(chatId, fs.createReadStream(barcodePath), { caption: 'Here is your Barcode!' });
      } else {
        console.error('File does not exist after creation:', barcodePath);
        bot.sendMessage(chatId, 'Failed to generate Barcode. Please try again.');
      }

    } catch (err) {
      bot.sendMessage(chatId, 'Failed to generate Barcode. Please try again.');
    } finally {
      if (fs.existsSync(barcodePath)) {
        fs.unlinkSync(barcodePath);
        console.log('Barcode file cleaned up.');
      }
    }
  }

  delete userChoices[userId];
});