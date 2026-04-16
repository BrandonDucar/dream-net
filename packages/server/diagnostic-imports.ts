import * as solana from '@solana/web3.js';
console.log('1. @solana/web3.js loaded');

import * as raydium from '@raydium-io/raydium-sdk';
console.log('2. @raydium-io/raydium-sdk loaded');

import axios from 'axios';
console.log('3. axios loaded');

import { ethers } from 'ethers';
console.log('4. ethers loaded');

import { ghostRPC } from './src/services/GhostRPCService.js';
console.log('5. GhostRPCService loaded');

import { Auditor } from './src/agents/Auditor.js';
console.log('6. Auditor loaded');

console.log('All metabolic dependencies verified.');
