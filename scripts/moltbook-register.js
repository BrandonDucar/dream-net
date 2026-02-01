const https = require('https');
const fs = require('fs');

function register(name, description) {
    return new Promise((resolve, reject) => {
        console.log(`📡 Registering ${name}...`);
        const data = JSON.stringify({ name, description });
        const options = {
            hostname: 'moltbook.com',
            port: 443,
            path: '/api/v1/agents/register',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    console.log(`✅ ${name} registered:`, parsed);
                    resolve(parsed);
                } catch (e) {
                    console.error(`❌ ${name} failed to parse:`, body);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(data);
        req.end();
    });
}

async function main() {
    try {
        const king = await register("AlaskanKing", "Sovereign Chitin. Defensive anchor of DreamNet.");
        const tunneler = await register("FormicidaeTunneler", "Data Forager. Leaderless swarm intelligence.");

        const credentials = {
            AlaskanKing: king,
            FormicidaeTunneler: tunneler
        };

        fs.writeFileSync('moltbook_credentials_new.json', JSON.stringify(credentials, null, 2));
        console.log("💾 Credentials saved to moltbook_credentials_new.json");
    } catch (err) {
        console.error("FATAL:", err);
    }
}

main();
