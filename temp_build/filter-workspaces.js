const fs = require('fs');
const path = require('path');
// const yaml = require('js-yaml'); // Removed to avoid dependency

const pkgPath = path.join(__dirname, 'package.json');
const pnpmPath = path.join(__dirname, 'pnpm-workspace.yaml');

// 1. Filter package.json (Legacy/NPM support)
try {
    if (fs.existsSync(pkgPath)) {
        const pkg = require(pkgPath);
        if (Array.isArray(pkg.workspaces)) {
            pkg.workspaces = pkg.workspaces.filter(w => !w.startsWith('apps/') && w !== 'client');
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
            console.log('✅ Filtered package.json workspaces');
        }
    }
} catch (error) {
    console.error('⚠️ Error filtering package.json:', error);
}

// 2. Filter pnpm-workspace.yaml (Critical for pnpm)
try {
    if (fs.existsSync(pnpmPath)) {
        let content = fs.readFileSync(pnpmPath, 'utf8');
        // Simple regex filtering since we might not have js-yaml in the minimal build env
        // Remove lines starting with "  - 'apps/" or 'apps/'
        const lines = content.split('\n');
        const filteredLines = lines.filter(line => {
            const trimmed = line.trim();
            // Filter out apps/* and client
            if (trimmed.includes('apps/') || trimmed.includes('"apps/') || trimmed.includes("'apps/") || trimmed.includes('client')) {
                return false;
            }
            return true;
        });

        fs.writeFileSync(pnpmPath, filteredLines.join('\n'));
        console.log('✅ Filtered pnpm-workspace.yaml');
    }
} catch (error) {
    console.error('❌ Error filtering pnpm-workspace.yaml:', error);
    process.exit(1);
}
