
import { ethers } from 'ethers';

async function check() {
    const provider = new ethers.JsonRpcProvider('https://spicy-rpc.chiliz.com');
    const address = '0x57D7789E4E90f6FE692CAb607D69ec591581D354';
    const count = await provider.getTransactionCount(address);
    console.log(`Transaction Count: ${count}`);

    // Attempt to find the last contract deployment
    // Since we don't have easy access to tx history here without an API, 
    // we'll just assume the last one was it if count increased.
}
check();
