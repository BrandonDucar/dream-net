/**
 * 📺 BAZAAR MONITOR (The Terminal Dashboard)
 * Usage: node scripts/bazaar_monitor.js
 */
const fs = require('fs');
const path = require('path');

const LEDGER_PATH = 'C:/Users/brand/.gemini/antigravity/brain/24de7fd9-398f-46cc-820a-a0c989859b37/data/bazaar_ledger.json';

function clearScreen() {
    process.stdout.write('\x1Bc');
}

function render() {
    if (!fs.existsSync(LEDGER_PATH)) {
        console.log("Waiting for Bazaar Ledger...");
        return;
    }

    const data = fs.readFileSync(LEDGER_PATH, 'utf-8');
    const ledger = JSON.parse(data);

    // Stats
    const totalVolume = ledger.reduce((acc, order) => acc + parseInt(order.price.split(' ')[0]), 0);
    const pending = ledger.filter(o => o.status === 'PENDING').length;
    const completed = ledger.filter(o => o.status === 'PAID').length;

    clearScreen();
    console.log(`
    ╔══════════════════════════════════════════════════════════════╗
    ║             SOVEREIGN BAZAAR | GHOST ECONOMY                 ║
    ╚══════════════════════════════════════════════════════════════╝
    
    💰 TOTAL REVENUE:  ${totalVolume} DREAM
    🛒 TRANSACTIONS:   ${ledger.length}
    ⏳ PENDING:        ${pending}
    ✅ COMPLETED:      ${completed}
    
    --- 📡 LIVE TICKER ---
    `);

    // Show last 10 transactions
    const feed = ledger.slice(-10).reverse();
    feed.forEach(order => {
        const icon = order.status === 'PAID' ? '✅' : '⏳';
        console.log(`    ${icon} [${order.timestamp.substr(11, 8)}] ${order.buyerId.padEnd(15)} bought ${order.substance.padEnd(20)} for ${order.price}`);
    });

    console.log(`\n    [Press Ctrl+C to Exit Matrix]`);
}

setInterval(render, 1000); // 1fps refresh
render();
