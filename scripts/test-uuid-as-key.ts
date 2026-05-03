import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const potentialKey = '54f2136f-5a26-4407-a182-0dd194fa55c8';

async function testKey() {
    console.log(`🔑 Testing UUID as API Key: ${potentialKey}\n`);
    try {
        const url = 'https://api.neynar.com/v2/farcaster/user/by_username/?username=ghostmint';
        const response = await axios.get(url, {
            headers: { 'x-api-key': potentialKey }
        });
        console.log('✅ Success! This is a valid API Key.');
        console.log('Response:', response.data.user.username);
    } catch (e: any) {
        console.log(`❌ Failed: ${e.response?.data?.message || e.message}`);
    }
}

testKey();
