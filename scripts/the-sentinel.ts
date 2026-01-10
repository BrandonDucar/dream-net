/**
 * 🛰️ THE SENTINEL
 * 
 * DreamNet Monorepo Build Guard & Hygiene Automation.
 * Prevents artifact poisoning and cross-package contamination.
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONOREPO_ROOT = path.resolve(__dirname, '..');
const SRC_DIRS = ['packages', 'shared', 'lib', 'server', 'client'];
const POISON_EXTENSIONS = ['.d.ts', '.js', '.js.map', '.tsbuildinfo'];

/**
 * Checks if a filename is a build artifact.
 */
function isArtifact(filename: string, fullPath: string): boolean {
    if (filename === 'tsconfig.tsbuildinfo') return true;
    const ext = path.extname(filename);
    if (ext === '.js' || ext === '.js.map') return true;
    if (fullPath.endsWith('.d.ts')) {
        // Only delete .d.ts if it's in a source directory (not node_modules or dist)
        const isInsideSource = !fullPath.includes(`${path.sep}node_modules${path.sep}`) &&
            !fullPath.includes(`${path.sep}dist${path.sep}`);
        return isInsideSource;
    }
    return false;
}

interface SentinelReport {
    deletedFiles: string[];
    errors: string[];
}

/**
 * Recursively scans and cleans source directories of build artifacts.
 */
function cleanSourceDir(dir: string, report: SentinelReport) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') {
                continue; // Skip output and dependency dirs
            }
            cleanSourceDir(fullPath, report);
        } else {
            if (isArtifact(entry.name, fullPath)) {
                try {
                    fs.unlinkSync(fullPath);
                    report.deletedFiles.push(fullPath);
                } catch (err) {
                    report.errors.push(`Failed to delete ${fullPath}: ${(err as Error).message}`);
                }
            }
        }
    }
}

async function runSentinel() {
    console.log('🛰️  SENTINEL: Initiating Monorepo Scan...');
    const report: SentinelReport = { deletedFiles: [], errors: [] };

    for (const dir of SRC_DIRS) {
        const targetDir = path.join(MONOREPO_ROOT, dir);
        console.log(`Checking ${dir}...`);
        cleanSourceDir(targetDir, report);
    }

    console.log('\n--- 📊 SENTINEL REPORT ---');
    if (report.deletedFiles.length > 0) {
        console.log(`✅ Cleared ${report.deletedFiles.length} poison artifacts.`);
        // Log first 10 for brevity
        report.deletedFiles.slice(0, 10).forEach(f => console.log(`  - Deleted: ${path.relative(MONOREPO_ROOT, f)}`));
        if (report.deletedFiles.length > 10) console.log(`  ... and ${report.deletedFiles.length - 10} more.`);
    } else {
        console.log('💎 No poison artifacts found. Environment is clean.');
    }

    if (report.errors.length > 0) {
        console.warn(`⚠️  Encountered ${report.errors.length} errors during scan.`);
    }
    console.log('--------------------------\n');
}

runSentinel();
