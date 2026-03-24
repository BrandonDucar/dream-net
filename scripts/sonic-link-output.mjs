import http from 'http';

/**
 * Sonic Link: Local Audio Bridge
 * 
 * Streams a raw PCM audio signal (Mono, 44100Hz, 16-bit) to localhost:3003/stream.
 * The frequency and amplitude are modulated by the swarm's collective 'Vibe'.
 * 
 * To listen: Open 'http://localhost:3003/stream' in VLC or any RAW-capable player.
 */

const PORT = 3003;
const SAMPLE_RATE = 44100;
let frequency = 440; // Default A4
let phase = 0;

// Mock vibe monitor (In production, this would poll HeadlessDJService)
setInterval(() => {
    // Mimic vibe-driven frequency shifts
    const vibeBase = [220, 330, 440, 554, 659]; // Cheddar Harmonic Series
    frequency = vibeBase[Math.floor(Math.random() * vibeBase.length)];
    console.log(`[SonicLink] Vibe Sync: ${frequency}Hz`);
}, 5000);

const server = http.createServer((req, res) => {
    if (req.url === '/stream') {
        console.log('[SonicLink] Client Connected. Streaming Vibe...');
        
        // Header for RAW PCM 16-bit Mono 44.1kHz
        res.writeHead(200, {
            'Content-Type': 'audio/l16',
            'Transfer-Encoding': 'chunked'
        });

        // Continuous audio generation loop
        const streamAudio = () => {
            const bufferSize = 4096;
            const buffer = Buffer.alloc(bufferSize * 2); // 16-bit = 2 bytes per sample

            for (let i = 0; i < bufferSize; i++) {
                // Generate sine wave
                const sample = Math.sin(phase) * 32767 * 0.5; // 50% volume
                buffer.writeInt16LE(Math.floor(sample), i * 2);
                
                // Advance phase
                phase += (2 * Math.PI * frequency) / SAMPLE_RATE;
                if (phase > 2 * Math.PI) phase -= 2 * Math.PI;
            }

            if (!res.writableEnded) {
                res.write(buffer);
                setTimeout(streamAudio, 20); // ~50fps delivery
            }
        };

        streamAudio();

        req.on('close', () => {
            console.log('[SonicLink] Client Disconnected.');
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`📡 [SonicLink] Local Stream Server: http://localhost:${PORT}/stream`);
    console.log(`🎶 [SonicLink] Ready for VLC / Media Player sync.`);
});
