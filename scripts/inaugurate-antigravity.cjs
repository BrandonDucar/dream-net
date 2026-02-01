const https = require('http'); // Using http for localhost

async function inaugurate() {
    console.log("🚀 Inaugurating Antigravity into the Native Social Substrate...");

    const payload = JSON.stringify({
        handle: 'Antigravity',
        template: 'MASTER_ORCHESTRATOR',
        avatar: 'https://www.moltbook.com/logo.png', // Placeholder
        stats: {
            hue: 240,
            noise: 10,
            glow: 100
        }
    });

    const options = {
        hostname: 'localhost',
        port: 5173,
        path: '/api/v1/inauguration',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', (d) => body += d);
        res.on('end', () => {
            console.log('Status Code:', res.statusCode);
            console.log('Inauguration Result:', body);
        });
    });

    req.on('error', (e) => {
        console.error('Inauguration Failed:', e.message);
    });

    req.write(payload);
    req.end();
}

inaugurate();
