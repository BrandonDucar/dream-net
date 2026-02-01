import { Client, GatewayIntentBits, ChannelType } from 'discord.js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
// Assumes script is run from project root
dotenv.config({ path: '.env' });

console.log('🔍 Looking for .env in current directory (CWD)');
const token = process.env.DISCORD_TOKEN;

if (!token) {
    console.error('❌ Error: DISCORD_TOKEN is missing from .env');
    console.log('Please add DISCORD_TOKEN=... to your .env file first.');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

client.once('ready', async (c) => {
    console.log(`\n🤖 Logged in as ${c.user.tag}`);
    console.log(`🆔 Client ID (Application ID): ${c.user.id}`);

    const guilds = await c.guilds.fetch();

    if (guilds.size === 0) {
        console.log('\n❌ This bot is not in any servers yet.');
        console.log('🔗 Use this link to invite it to your server:');
        console.log(`   https://discord.com/api/oauth2/authorize?client_id=${c.user.id}&permissions=2147483648&scope=bot%20applications.commands`);
        console.log('\n(Once invited, run this script again to get the IDs)');
    } else {
        console.log(`\n✅ Found ${guilds.size} Server(s):`);

        for (const [id, oauthGuild] of guilds) {
            const guild = await oauthGuild.fetch();
            console.log(`\n---------------------------------------------------`);
            console.log(`🏰 Server: "${guild.name}"`);
            console.log(`📝 DISCORD_GUILD_ID=${guild.id}`);

            const channels = await guild.channels.fetch();
            const textChannels = channels.filter(ch => ch && ch.type === ChannelType.GuildText);

            console.log(`\n   Available Text Channels:`);
            let foundGeneral = false;

            textChannels.forEach(ch => {
                if (ch) {
                    console.log(`   # ${ch.name.padEnd(20)} -> DISCORD_DEFAULT_CHANNEL_ID=${ch.id}`);
                    if (ch.name === 'general') foundGeneral = true;
                }
            });

            console.log(`\n---------------------------------------------------`);
        }
    }

    // Graceful exit
    setTimeout(() => {
        console.log('\nDiscovery Complete. Closing connection...');
        client.destroy();
        process.exit(0);
    }, 1000);
});

client.login(token).catch(err => {
    console.error('\n❌ Login Failed. Please check your DISCORD_TOKEN.');
    console.error(err.message);
    process.exit(1);
});
