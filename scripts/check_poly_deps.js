try {
    require('@polymarket/clob-client');
    require('ethers');
    console.log("SUCCESS");
} catch (e) {
    console.log("MISSING");
    console.error(e.message);
}
