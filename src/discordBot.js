const Discord = require('discord.js');
const client = new Discord.Client();
const TELEGRAM_API_URL = 'https://api.telegram.org/bot<YOUR_TELEGRAM_BOT_TOKEN>/sendMessage';

client.on('message', message => {
    if (!message.author.bot) {
        // Send the message to Telegram
        fetch(TELEGRAM_API_URL, {
            method: 'POST',
            body: JSON.stringify({ chat_id: '<YOUR_TELEGRAM_CHAT_ID>', text: message.content }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
});

client.login('<YOUR_DISCORD_BOT_TOKEN>');
