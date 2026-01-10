import { Connection, PublicKey } from '@solana/web3.js';
import * as monaco from '@monaco-protocol/client';
import { ghostRPC } from './src/services/GhostRPCService.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

async function debug() {
    const connection = ghostRPC.getConnection();
    const programId = new PublicKey('monacoUXKtUi6vKsQwaLyTxqBNkpKRn9QZFSe7bFreq');

    console.log('--- MONACO DEBUG ---');
    console.log('Available keys:', Object.keys(monaco));

    try {
        console.log('Attempting monaco.getMarkets...');
        // getMarkets usually takes a connection and programId
        const res = await monaco.getMarkets(connection, programId);
        console.log('Response Keys:', Object.keys(res));
        if (res.data) console.log('Data keys:', Object.keys(res.data));
    } catch (e: any) {
        console.log('getMarkets Error:', e.message);
    }

    try {
        console.log('\nAttempting monaco.getMarketAccountsByStatus...');
        const status = monaco.MarketStatusFilter.Open;
        const res2 = await monaco.getMarketAccountsByStatus(connection, programId, status);
        console.log('Response Keys:', Object.keys(res2));
    } catch (e: any) {
        console.log('getMarketAccountsByStatus Error:', e.message);
    }
}

debug().catch(console.error);
