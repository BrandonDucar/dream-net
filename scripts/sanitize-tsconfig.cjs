
const fs = require('fs');
const path = require('path');

const packagesDir = path.resolve(__dirname, '../packages');

function sanitize(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            // Look for tsconfig.json
            const tsConfigPath = path.join(fullPath, 'tsconfig.json');
            if (fs.existsSync(tsConfigPath)) {
                try {
                    let content = fs.readFileSync(tsConfigPath, 'utf8');

                    // Regex to find the reference blocks for core organs
                    const regex = /\{\s*"path":\s*"\.\.\/(neural-mesh|memory-dna|halo-loop|aethersafe-core)"\s*\},?/g;

                    if (regex.test(content)) {
                        console.log(`Sanitizing ${tsConfigPath}`);
                        let newContent = content.replace(regex, '');

                        // Clean up list artifacts
                        // If we left a trailing comma in the list (e.g. item, item, ] -> item, item])
                        // Actually JSON parser allows trailing comma in VSCode but not strict JSON.
                        // But TSConfig usually allows comments/trailing commas.
                        // However, let's try to be clean.
                        // [ , ] -> [ ]
                        newContent = newContent.replace(/\[\s*,/g, '[');
                        // , ] -> ]
                        newContent = newContent.replace(/,\s*\]/g, ']');
                        // , , -> ,
                        newContent = newContent.replace(/,\s*,/g, ',');

                        fs.writeFileSync(tsConfigPath, newContent);
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
