const fs = require('fs');
try {
    const path = require.resolve('@polymarket/clob-client');
    console.log("SUCCESS");
} catch (e) {
    console.log("MISSING");
}
