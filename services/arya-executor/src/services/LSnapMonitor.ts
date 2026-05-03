import { JsonRpcProvider, Contract, formatEther } from 'ethers';

const LSNAP_ADDRESS = '0x218b2d9381f45d8cd0c816ea3fcd3f78ab4638ed';
const BASE_RPC = 'https://mainnet.base.org';

// Minimal ERC20 ABI for monitoring
const ABI = [
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function balanceOf(address) view returns (uint256)'
];

export class LSnapMonitor {
  private provider: JsonRpcProvider;
  private contract: Contract;

  constructor() {
    this.provider = new JsonRpcProvider(BASE_RPC);
    this.contract = new Contract(LSNAP_ADDRESS, ABI, this.provider);
  }

  public async startMonitoring(callback: (to: string, value: string) => void) {
    console.log(`🔍 [LSNAP] Monitoring contract: ${LSNAP_ADDRESS}`);
    this.contract.on('Transfer', (from, to, value) => {
      if (from === '0x0000000000000000000000000000000000000000') {
        console.log(`✨ [LSNAP] New Mint! ${formatEther(value)} LSNAP to ${to}`);
        callback(to, formatEther(value));
      }
    });
  }
}
