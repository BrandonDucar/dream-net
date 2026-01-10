const fs = require('fs');
const path = require('path');
const src = 'C:\\Users\\brand\\.gemini\\antigravity\\brain\\24de7fd9-398f-46cc-820a-a0c989859b37\\sovereign_bond_certificate_1767679966819.png';
const dest = 'C:\\Users\\brand\\Desktop\\dreamnet_sovereign_bond.png';

try {
    fs.copyFileSync(src, dest);
    console.log('✅ SUCCESSFULLY COPIED Sovereign Bond to: ' + dest);
} catch (err) {
    console.error('❌ Failed to copy:', err);
}
