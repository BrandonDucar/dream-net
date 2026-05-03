import fs from 'fs';
import path from 'path';
import { storage } from '../storage.js';
import { natsService } from '../services/NatsService.js';

/**
 * 📚 Librarian Agent
 * Scans the codebase for libraries, catalogs them in the database,
 * and manages the "Library Vault" registry.
 */
export class LibrarianAgent {
    private name = 'Librarian Agent';
    private packagesRoot = path.join(process.cwd(), 'packages');

    constructor() {
        console.log(`📚 [Librarian Agent] Initializing registry...`);
        this.startScanningLoop();
    }

    private startScanningLoop(): void {
        // Initial scan
        this.scanLibraries().catch(err => console.error(`📚 [Librarian Agent] Initial scan failed:`, err));

        // Periodic scan every 12 hours
        setInterval(() => {
            this.scanLibraries().catch(err => console.error(`📚 [Librarian Agent] Periodic scan failed:`, err));
        }, 12 * 60 * 60 * 1000);
    }

    public async scanLibraries(): Promise<void> {
        console.log(`📚 [Librarian Agent] Scanning for libraries in ${this.packagesRoot}...`);
        
        try {
            const items = await fs.promises.readdir(this.packagesRoot, { withFileTypes: true });
            const packageDirs = items.filter(item => item.isDirectory());

            for (const dir of packageDirs) {
                const packagePath = path.join(this.packagesRoot, dir.name);
                const packageJsonPath = path.join(packagePath, 'package.json');

                if (fs.existsSync(packageJsonPath)) {
                    try {
                        const content = await fs.promises.readFile(packageJsonPath, 'utf-8');
                        const pkg = JSON.parse(content);

                        await storage.upsertLibrary({
                            name: pkg.name || dir.name,
                            version: pkg.version || '0.0.1',
                            description: pkg.description || '',
                            packagePath: dir.name,
                            author: typeof pkg.author === 'string' ? pkg.author : JSON.stringify(pkg.author),
                            license: pkg.license || 'Apache-2.0',
                            dependencies: pkg.dependencies || {},
                            metadata: {
                                scripts: pkg.scripts || {},
                                devDependencies: pkg.devDependencies || {},
                                type: pkg.type || 'module'
                            }
                        });

                        console.log(`📚 [Librarian Agent] Cataloged: ${pkg.name}`);
                    } catch (err) {
                        console.warn(`📚 [Librarian Agent] Failed to parse ${packageJsonPath}:`, err);
                    }
                }
            }

            console.log(`📚 [Librarian Agent] Scan complete.`);
            await natsService.publish('dreamnet.librarian.scan_complete', {
                timestamp: new Date().toISOString(),
                agent: this.name
            });
        } catch (err) {
            console.error(`📚 [Librarian Agent] Scan error:`, err);
        }
    }

    public async getLibraryStats() {
        const libs = await storage.getLibraries();
        return {
            totalLibraries: libs.length,
            lastScanned: libs.length > 0 ? libs[0].lastScannedAt : null
        };
    }
}

export const librarianAgent = new LibrarianAgent();
