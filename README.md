
# Telegram QR Code & Barcode Generator Bot

This Telegram bot allows users to generate QR codes and barcodes by sending a simple text message. The bot supports inline keyboard options for selecting whether to generate a QR code or barcode, and allows for returning to the main menu after selecting an option.

## Features

- Generates **QR Codes** from user-provided text.
- Generates **Barcodes** using the Code128 format from user-provided text.
- Sends the generated QR code or barcode as a photo in the chat.

## Prerequisites

To run this bot, you need the following:

- **Node.js** (version 16 or above recommended).
- **Telegram Bot Token** from [BotFather](https://core.telegram.org/bots#botfather).
- **npm packages**: `node-telegram-bot-api`, `bwip-js`, `qrcode`, `dotenv`.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/telegram-qr-barcode-bot.git
   ```

2. Navigate to the project directory:

   ```bash
   cd telegram-qr-barcode-bot
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root with your Telegram bot token:

   ```text
   TELEGRAM_TOKEN=your-telegram-bot-token
   ```

   Replace `your-telegram-bot-token` with your actual bot token from BotFather.

## Usage

1. Start the bot by running the following command:

   ```bash
   node bot.js
   ```

2. Open Telegram and search for your bot (by the username you set when creating the bot).
3. Click on **Start** to begin interacting with the bot.
4. Choose between generating a **QR Code** or **Barcode**.
5. Send the text you would like to convert into a QR code or barcode.

## How It Works

- The bot uses the **node-telegram-bot-api** library to interact with Telegram's API and send messages/photos to users.
- QR codes are generated using the **QRCode** library, while barcodes are generated using **bwip-js**.
- The bot saves the generated QR code or barcode as an image file and sends it to the user.
- After the file is sent, the bot cleans up the image file to free up space.

## Customization

- You can customize the **QR code and barcode options** (e.g., barcode format, QR code size) by editing the code in the `bot.js` file.
- To modify the bot's inline keyboard, simply change the buttons in the `options` object.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork this project and submit pull requests if you'd like to contribute. Please ensure that your changes are well-documented and tested.

## Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api) for providing an easy way to interact with Telegram.
- [QRCode](https://www.npmjs.com/package/qrcode) and [bwip-js](https://www.npmjs.com/package/bwip-js) for generating QR codes and barcodes.

## Contact

For questions or suggestions, contact:

- Telegram: [@Ru\_bic](https://t.me/Ru_Bic)
- Email: [rubikmanyt@Gmail.com](mailto\:rubikmanyt@Gmail.com)