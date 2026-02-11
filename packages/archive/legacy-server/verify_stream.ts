
import http from 'http';

console.log("Connecting to DreamNet God View...");

const req = http.request("http://127.0.0.1:3333/api/god-view/stream", (res) => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);

    res.on('data', (chunk) => {
        const text = chunk.toString();
        // Simple parsing of SSE format
        if (text.startsWith('data:')) {
            console.log("\n⚡ [RECEIVED THOUGHT]:");
            console.log(text.replace('data: ', '').trim());
        }
    });

    res.on('end', () => {
        console.log('Stream ended.');
    });
});

req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

req.end();

// Keep alive for 10 seconds
setTimeout(() => {
    console.log("Test Complete. Closing connection.");
    req.destroy();
}, 10000);
