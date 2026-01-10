/**
 * 👨‍⚕️ THE SURGEON
 * 
 * DreamNet Monorepo Import Standardization Tool.
 * Automatically converts relative cross-package imports to workspace aliases (@dreamnet/*).
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONOREPO_ROOT = path.resolve(__dirname, '..');
const SEARCH_DIRS = ['packages', 'server', 'client', 'spine', 'apps'];
const WORKSPACE_PACKAGES = [
    'internal-ports',
    'shared',
    'lib',
    'internal-router',
    'event-wormholes',
    'star-bridge-lungs',
    'database',
    'dream-state-core',
    'utils',
    'nerve',
    'metrics-engine',
    'shield-core',
    'forge-fix-core',
    'dreamnet-os-core',
    'bio-core',
    'graft-engine',
    'memory-dna',
    'neural-mesh',
    'squad-alchemy',
    'squad-builder',
    'identity-grid',
    'dreamnet-identity-passport-bridge'
];

interface SurgeonReport {
    modifiedFiles: string[];
    totalFixes: number;
}

/**
 * Standardizes imports in a single file.
 */
function standardizeFile(filePath: string, report: SurgeonReport) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixCount = 0;

    // Pattern to match ../../packages/some-package or ../../shared
    // We look for relative paths that point to known workspace packages
    WORKSPACE_PACKAGES.forEach(pkg => {
        // Note: This regex is intentionally broad to catch various nesting depths
        // It looks for ../ followed by more ../ (or nothing) then the package name
        // e.g., ../../packages/internal-ports or ../../shared

        // Case 1: packages/*
        const packageRegex = new RegExp(`['"](\\.\\.\\/)+(packages\\/)?${pkg}(/src)?(/index)?['"]`, 'g');
        content = content.replace(packageRegex, (match) => {
            fixCount++;
            return `'@dreamnet/${pkg}'`;
        });
    });

    // Case 2: ESM Relative Imports (NodeNext compliance)
    // Matches import ... from './something' or dynamic import('./something')
    // but ignores imports that already have an extension or are from node_modules
    content = content.replace(/(from|import\s*\()\s*['"](\.\/|\.\.\/)([^'"]+)['"]/g, (match, prefix, pathPrefix, path) => {
        if (path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.json') || path.endsWith('.svg')) {
            return match;
        }
        fixCount++;
        // We matched the prefix (e.g. 'from' or 'import(') and the path.
        // We just return the prefix + the new path + the .js extension.
        // The closing paren for dynamic imports is NOT in the match, 
        // so it remains in the original string.
        return `${prefix}'${pathPrefix}${path}.js'`;
    });

    // Case 3: Self-Repair (Fixing the double-parentheses glitch from previous run)
    // Matches .js')) and reduces it to .js')
    content = content.replace(/\.js['"]\)\)/g, (match) => {
        fixCount++;
        return ".js')";
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content);
        report.modifiedFiles.push(filePath);
        report.totalFixes += fixCount;
    }
}

function processDir(dir: string, report: SurgeonReport) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue;
            processDir(fullPath, report);
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
            standardizeFile(fullPath, report);
        }
    }
}

async function runSurgeon() {
    console.log('👨‍⚕️  SURGEON: Initiating Monorepo Operation...');
    const report: SurgeonReport = { modifiedFiles: [], totalFixes: 0 };

    for (const dir of SEARCH_DIRS) {
        const targetDir = path.join(MONOREPO_ROOT, dir);
        console.log(`Operating on ${dir}...`);
        processDir(targetDir, report);
    }

    console.log('\n--- 📊 SURGEON REPORT ---');
    if (report.modifiedFiles.length > 0) {
        console.log(`✅ Standardized ${report.totalFixes} imports across ${report.modifiedFiles.length} files.`);
    } else {
        console.log('💎 All imports are already standardized. No operation needed.');
    }
    console.log('--------------------------\n');
}

runSurgeon();
