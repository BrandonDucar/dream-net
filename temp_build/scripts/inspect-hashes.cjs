
const fs = require('fs');
const path = require('path');

const packagePath = path.resolve(__dirname, '../node_modules/@noble/hashes/package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('Exports for ripemd160:', pkg.exports['./ripemd160']);
console.log('Exports for ./ripemd160.js:', pkg.exports['./ripemd160.js']);
console.log('All exports:', JSON.stringify(pkg.exports, null, 2));
