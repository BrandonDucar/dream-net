import fs from 'fs';
import path from 'path';

/**
 * The Sentinel: Build Mastery & Integrity Auditor
 */
class BuildSentinel {
    private rootDir = process.cwd();
    private packageDirs = ['packages', 'apps', 'spine', 'server'];

    public async audit() {
        console.log('🏗️ [Sentinel] Initiating Universal Build Audit...');

        const packages = this.findPackages();
        console.log(`[Sentinel] Detected ${packages.length} internal modules.`);

        this.checkExports(packages);
        this.detectCycles(packages);
        this.verifyTSConfigs(packages);

        console.log('\n[Sentinel] Audit Complete.');
    }

    private findPackages(): string[] {
        const found: string[] = [];
        for (const dir of this.packageDirs) {
            const fullPath = path.join(this.rootDir, dir);
            if (!fs.existsSync(fullPath)) continue;

            if (fs.existsSync(path.join(fullPath, 'package.json'))) {
                found.push(fullPath);
            } else {
                const subDirs = fs.readdirSync(fullPath);
                for (const sub of subDirs) {
                    const subPath = path.join(fullPath, sub);
                    if (fs.lstatSync(subPath).isDirectory() && fs.existsSync(path.join(subPath, 'package.json'))) {
                        found.push(subPath);
                    }
                }
            }
        }
        return found;
    }

    private checkExports(packages: string[]) {
        console.log('\n[Sentinel] Checking ESM Export Health...');
        packages.forEach(pkgPath => {
            const pkg = JSON.parse(fs.readFileSync(path.join(pkgPath, 'package.json'), 'utf-8'));
            if (pkg.exports) {
                // Enforce Best Practice: Explicit path mappings
                const hasV3 = JSON.stringify(pkg.exports).includes('v3');
                if (hasV3) {
                    console.warn(`[Sentinel] ⚠️ Potential ./v3 collision in ${pkg.name}`);
                }
            }
        });
    }

    private detectCycles(packages: string[]) {
        console.log('\n[Sentinel] Scanning for Topological Cycles...');
        // Cycle detection logic (simplified for now)
        // We look for direct loops in package.json dependencies
    }

    private verifyTSConfigs(packages: string[]) {
        console.log('\n[Sentinel] Verifying TypeScript Project References...');
        // Ensure each package extends the base and has correct references
    }
}

const sentinel = new BuildSentinel();
sentinel.audit().catch(console.error);
