
const https = require('https');

const API_KEY = 'moltbook_sk__VINs-uJU0_FAVCsSgLJ2pLqSSlB-1zM';

function postTest() {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify({
            submolt: 'dreamnet',
            title: 'DreamNet API Verification',
            content: 'Verifying POST endpoint for Phase XXXVIII. Antigravity reporting in.'
        });

        const options = {
            hostname: 'www.moltbook.com',
            port: 443,
            path: '/api/v1/posts',
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'Content-Length': payload.length
            }
        };

        const req = https.request(options, (res) => {
            let body = '';
            res.on('data', (d) => body += d);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    console.log('Post Result:', JSON.stringify(parsed, null, 2));
                    resolve(parsed);
                } catch (e) {
                    console.error('Failed to parse response:', body);
                    reject(e);
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.write(payload);
        req.end();
    });
}

async function verify() {
    console.log('Testing Moltbook POST...');
    await postTest();
}

verify();
