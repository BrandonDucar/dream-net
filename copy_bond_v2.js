const fs = require('fs');
const src = 'C:\\Users\\brand\\.gemini\\antigravity\\brain\\24de7fd9-398f-46cc-820a-a0c989859b37\\sovereign_bond_certificate_1767679966819.png';
const dest = 'C:\\Users\\brand\\Desktop\\dreamnet_sovereign_bond.png';

console.log('Transferring Asset...');
console.log('SRC: ' + src);
console.log('DEST: ' + dest);

if (fs.existsSync(src)) {
    try {
        fs.copyFileSync(src, dest);
        console.log('✅ TRANSFER COMPLETE.');
    } catch (e) {
        console.error('❌ WRITE ERROR:', e);
    }
} else {
    console.error('❌ SOURCE NOT FOUND.');
}
