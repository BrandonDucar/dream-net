import express from 'express';
import { Server } from 'http';

/**
 * AuthReceptor
 * A transient receptor that listens for the 'Scan-In' signal.
 */
export class AuthReceptor {
    private app: express.Express;
    private server?: Server;
    private port: number;

    constructor(port: number = 5000) {
        this.app = express();
        this.port = port;
    }

    /**
     * catchSignal
     * Opens the receptor and waits for a single authorization code.
     */
    public async catchSignal(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.app.get('/api/auth/google/callback', (req, res) => {
                const { code, error } = req.query;

                if (error) {
                    res.status(400).send(`<h1>Scan-In Failed</h1><p>${error}</p>`);
                    reject(new Error(`Google Auth Error: ${error}`));
                    return;
                }

                if (code) {
                    res.send(`
                        <html>
                            <body style="background: #000; color: #0f0; font-family: monospace; display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column;">
                                <h1 style="border: 2px solid #0f0; padding: 20px;">🧬 SCAN-IN SUCCESSFUL</h1>
                                <p>The Wolf Pack has captured your metabolic signal.</p>
                                <p>You can close this window now.</p>
                            </body>
                        </html>
                    `);
                    resolve(code as string);
                    this.stop();
                } else {
                    res.status(400).send("No code found.");
                }
            });

            this.server = this.app.listen(this.port, '0.0.0.0', () => {
                console.log(`[🤱 Nursery] Auth Receptor online at http://localhost:${this.port}. Waiting for signal...`);
            });

            // Timeout after 30 minutes for ample verification time
            setTimeout(() => {
                this.stop();
                reject(new Error("Auth Receptor timed out (30m limit)."));
            }, 1800000);
        });
    }

    public stop() {
        if (this.server) {
            this.server.close();
            console.log("[🤱 Nursery] Auth Receptor deactivated.");
        }
    }
}
