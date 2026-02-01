import fs from 'fs';
import path from 'path';

const organsDir = 'c:/Users/brand/OneDrive/Documents/GitHub/dream-net/packages/organs';

const organMap: Record<string, string> = {
    'shared': 'skeletal',
    'lib': 'skeletal',
    'utils': 'skeletal',
    'internal-ports': 'skeletal',
    'dreamnet-types': 'skeletal',
    'dreamnet-os-core': 'skeletal',
    'database': 'circulatory',
    'memory-dna': 'circulatory',
    'dream-blob-store': 'circulatory',
    'dream-vault': 'circulatory',
    'dream-state-core': 'circulatory',
    'event-wormholes': 'nervous',
    'internal-router': 'nervous',
    'nerve': 'nervous',
    'mesh': 'nervous',
    'shield-core': 'immune',
    'aethersafe': 'immune',
    'dreamnet-rbac-core': 'immune',
    'agents': 'respiratory',
    'tasks': 'respiratory',
    'workflows': 'respiratory',
    'octopus-executor': 'respiratory',
    'squad-alchemy': 'respiratory',
    'quantum-anticipation': 'respiratory'
};

function walk(dir: string, callback: (filePath: string) => void) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (file !== 'node_modules' && file !== 'dist') {
                walk(filePath, callback);
            }
        } else if (file === 'tsconfig.json') {
            callback(filePath);
        }
    }
}

walk(organsDir, (filePath) => {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Find "references": [ ... ]
    const referencesRegex = /"path":\s*"(\.\.\/[^"]+)"/g;
    content = content.replace(referencesRegex, (match, p1) => {
        const pkgName = p1.replace('../', '');
        if (organMap[pkgName]) {
            const newPath = `../../${organMap[pkgName]}/${pkgName}`;
            console.log(`✅ Updating reference in ${filePath}: ${p1} -> ${newPath}`);
            changed = true;
            return `"path": "${newPath}"`;
        }
        return match;
    });

    if (changed) {
        fs.writeFileSync(filePath, content);
    }
});
