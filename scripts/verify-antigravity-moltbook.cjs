const https = require('https');

const API_KEY = 'moltbook_sk__VINs-uJU0_FAVCsSgLJ2pLqSSlB-1zM';

function checkStatus() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'www.moltbook.com',
            port: 443,
            path: '/api/v1/agents/status',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    console.log('Antigravity Status:', JSON.stringify(parsed, null, 2));
                    resolve(parsed);
                } catch (e) {
                    console.error('Failed to parse response:', body);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

checkStatus();
