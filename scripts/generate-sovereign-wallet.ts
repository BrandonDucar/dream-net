import { ethers } from "ethers";
import * as fs from "fs";
import * as path from "path";

/**
 * 🔐 WALLET GENERATOR FOR DREAMNET
 * 
 * Generates a new Ethereum wallet for Lens registration or other sovereign operations.
 * Saves the public address to the console and prompts for .env update.
 */

async function generateWallet() {
    console.log('🔐 [WalletGen] Generating new sovereign identity...');
    
    const wallet = ethers.Wallet.createRandom();
    
    console.log('\n--- NEW WALLET GENERATED ---');
    console.log(`📍 Address: ${wallet.address}`);
    console.log(`🔑 Private Key: ${wallet.privateKey}`);
    console.log(`📜 Mnemonic: ${wallet.mnemonic?.phrase}`);
    console.log('----------------------------\n');
    
    console.log('⚠️ [IMPORTANT] Please fund this address with Polygon (POL) and GHO (if required) for Lens registration.');
    console.log('💡 I will now attempt to update the local .env file with this private key.');

    const envPath = path.resolve(process.cwd(), '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
    }

    const lines = envContent.split('\n');
    let found = false;
    const newLines = lines.map(line => {
        if (line.startsWith('LENS_PRIVATE_KEY=')) {
            found = true;
            return `LENS_PRIVATE_KEY=${wallet.privateKey}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`LENS_PRIVATE_KEY=${wallet.privateKey}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log('✅ [WalletGen] .env updated with LENS_PRIVATE_KEY.');
    console.log('🚀 Next step: Fund the wallet and run registration.');
}

generateWallet();
