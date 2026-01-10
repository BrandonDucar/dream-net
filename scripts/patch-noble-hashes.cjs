
const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../node_modules/@noble/hashes/package.json');
const utilsPath = path.resolve(__dirname, '../node_modules/@noble/hashes/utils.js');

if (!fs.existsSync(packagePath)) {
    console.error('Could not find @noble/hashes/package.json at', packagePath);
    process.exit(1);
}

// 1. Patch package.json
try {
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    let modifiedPkg = false;

    // Ensure type: module
    if (pkg.type !== 'module') {
        pkg.type = 'module';
        console.log('Added "type": "module" to package.json');
        modifiedPkg = true;
    }

    // Standard exports
    const standardExports = ['sha2', 'sha3', 'sha256', 'sha512', 'utils', 'hmac', 'pbkdf2', 'blake2b', 'blake2s', 'blake3', 'scrypt'];

    // Legacy exports (map to legacy.js)
    const legacyExports = ['ripemd160', 'sha1', 'md5'];

    standardExports.forEach(name => {
        const keyJs = `./${name}.js`;
        if (!pkg.exports[keyJs]) {
            pkg.exports[keyJs] = pkg.exports[`./${name}`] || `./${name}.js`;
            console.log(`Added export for ${keyJs}`);
            modifiedPkg = true;
        }
        const keyNoExt = `./${name}`;
        if (!pkg.exports[keyNoExt]) {
            pkg.exports[keyNoExt] = `./${name}.js`;
            console.log(`Added export for ${keyNoExt}`);
            modifiedPkg = true;
        }
    });

    legacyExports.forEach(name => {
        const keyJs = `./${name}.js`;
        // FORCE overwrite for legacy
        if (pkg.exports[keyJs] !== './legacy.js') {
            pkg.exports[keyJs] = './legacy.js';
            console.log(`Updated export for ${keyJs} -> ./legacy.js`);
            modifiedPkg = true;
        }
        const keyNoExt = `./${name}`;
        if (pkg.exports[keyNoExt] !== './legacy.js') {
            pkg.exports[keyNoExt] = './legacy.js';
            console.log(`Updated export for ${keyNoExt} -> ./legacy.js`);
            modifiedPkg = true;
        }
    });

    if (modifiedPkg) {
        fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
        console.log('Successfully patched @noble/hashes/package.json');
    } else {
        console.log('@noble/hashes/package.json already patched');
    }
} catch (e) {
    console.error('Error patching package.json:', e);
}

// 2. Patch utils.js
if (fs.existsSync(utilsPath)) {
    try {
        let content = fs.readFileSync(utilsPath, 'utf8');

        // Check if already patched
        if (!content.includes('export const abytes')) {
            console.log('Patching utils.js to add abytes...');

            const patchCode = `
// Patched by DreamNet
export const abytes = (b, ...args) => { 
  if (!b) throw new Error("Bytes expected"); 
};
`;
            const newContent = content + '\n' + patchCode;
            fs.writeFileSync(utilsPath, newContent);
            console.log('Patched @noble/hashes/utils.js with abytes');
        } else {
            console.log('@noble/hashes/utils.js already has abytes');
        }
    } catch (e) {
        console.error('Error patching utils.js:', e);
    }
} else {
    console.error('Could not find @noble/hashes/utils.js at', utilsPath);
}
