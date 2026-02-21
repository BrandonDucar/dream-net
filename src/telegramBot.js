const TelegramBot = require('node-telegram-bot-api');
const DISCORD_WEBHOOK_URL = '<YOUR_DISCORD_WEBHOOK_URL>';
const bot = new TelegramBot('<YOUR_TELEGRAM_BOT_TOKEN>', { polling: true });

bot.on('message', (msg) => {
    // Send to Discord
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({ content: msg.text }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
});
