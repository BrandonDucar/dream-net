import dotenv from 'dotenv';
dotenv.config();

async function verify() {
    const key = process.env.NEYNAR_API_KEY;
    if (!key) {
        console.error("❌ Neynar API Key missing from environment.");
        process.exit(1);
    }
    console.log(`📡 Testing Neynar API (Key starts with: ${key.substring(0, 5)}...)`);

    try {
        const response = await fetch('https://api.neynar.com/v2/farcaster/user/bulk?fids=3', {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'api_key': key
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("✅ Neynar API Response OK!");
            console.log("👤 Test User (FID 3):", data.users[0]?.username);
        } else {
            console.error(`❌ Neynar API Error: ${response.status} ${response.statusText}`);
            const err = await response.text();
            console.error(err);
        }
    } catch (e) {
        console.error("❌ Network/Request Error:", e);
    }
}

verify();
