
const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '../packages');

function sanitize(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Look for tsconfig.json
            const tsConfigPath = path.join(fullPath, 'tsconfig.json');
            if (fs.existsSync(tsConfigPath)) {
                try {
                    // Read and preserve formatting if possible, but JSON.stringify is safer for structure
                    // actually regex replacement might be safer to preserve comments if any?
                    // But tsconfig often has comments which JSON.parse hates unless stripped.
                    // Let's assume standard JSON or just use regex to remove the block.

                    let content = fs.readFileSync(tsConfigPath, 'utf8');

                    // Regex to find the reference block: { "path": "../neural-mesh" } with specific whitespace flexibility
                    // We match the object logic.
                    const regex = /\{\s*"path":\s*"\.\.\/neural-mesh"\s*\},?/g; // Trailing comma optional

                    if (regex.test(content)) {
                        console.log(`Sanitizing ${tsConfigPath}`);
                        const newContent = content.replace(regex, '');
                        // Clean up double commas if any left behind
                        const cleanContent = newContent.replace(/,(\s*])/, '$1').replace(/,(\s*,)/, ',');
                        fs.writeFileSync(tsConfigPath, cleanContent);
                    }
                } catch (e) {
                    console.error(`Error processing ${tsConfigPath}:`, e);
                }
            }
        }
    }
}

sanitize(packagesDir);
console.log("Sanitization complete.");
