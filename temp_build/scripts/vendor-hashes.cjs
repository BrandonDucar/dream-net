
const fs = require('fs');
const path = require('path');

const sourceDir = path.resolve(__dirname, '../node_modules/@noble/hashes');
const targetDir = path.resolve(__dirname, '../client/src/vendor/noble-hashes');

if (!fs.existsSync(sourceDir)) {
    console.error('Source directory not found:', sourceDir);
    process.exit(1);
}

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log('Created target directory:', targetDir);
}

const filesToCopy = [
    'sha256.js', 'sha512.js', 'sha2.js',
    'utils.js',
    'hmac.js', 'pbkdf2.js',
    'legacy.js', // for ripemd160, sha1, md5
    'sha3.js',
    'blake2b.js', 'blake2s.js', 'blake3.js',
    'scrypt.js',
    'sha1.js',
    '_md.js', '_u64.js', '_blake.js' // internal dependencies
];

filesToCopy.forEach(file => {
    const srcPath = path.join(sourceDir, file);
    const destPath = path.join(targetDir, file);

    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file}`);
    } else {
        console.warn(`Warning: Source file not found: ${file}`);
    }
});

// Create a package.json in vendor dir to ensure it's treated as module if needed, 
// or just rely on file extensions.
const pkgContent = {
    "type": "module"
};
fs.writeFileSync(path.join(targetDir, 'package.json'), JSON.stringify(pkgContent, null, 2));
console.log('Created package.json in vendor dir');
