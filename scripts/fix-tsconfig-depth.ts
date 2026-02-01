import fs from 'fs';
import path from 'path';

const organsDir = 'c:/Users/brand/OneDrive/Documents/GitHub/dream-net/packages/organs';

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
    if (content.includes('"extends": "../../tsconfig.base.json"')) {
        console.log(`✅ Updating ${filePath}`);
        content = content.replace('"extends": "../../tsconfig.base.json"', '"extends": "../../../../tsconfig.base.json"');
        fs.writeFileSync(filePath, content);
    } else if (content.includes('"extends": "../tsconfig.base.json"')) {
        console.log(`⚠️  Found 1-level extension in ${filePath}, updating to 4 levels...`);
        content = content.replace('"extends": "../tsconfig.base.json"', '"extends": "../../../../tsconfig.base.json"');
        fs.writeFileSync(filePath, content);
    }
});
