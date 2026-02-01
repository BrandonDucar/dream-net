import { ethers } from 'ethers';
import { UserOperation } from './types.js';

export class UserOpBuilder {
  private entryPoint: string;
  private sender: string;

  constructor(entryPoint: string, sender: string) {
    this.entryPoint = entryPoint;
    this.sender = sender;
  }

  /**
   * Builds a simple transfer UserOperation.
   */
  public async buildTransferOp(
    to: string,
    amount: bigint,
    token?: string
  ): Promise<Partial<UserOperation>> {
    let callData = '';
    
    // In actual Smart Accounts (like Safe or Kernel), we use an 'execute' method.
    // Assuming a standard 'execute(address to, uint256 value, bytes calldata data)' pattern.
    const saInterface = new ethers.Interface([
      'function execute(address to, uint256 value, bytes calldata data)'
    ]);

    if (token) {
      // ERC20 Transfer
      const erc20Interface = new ethers.Interface([
        'function transfer(address to, uint256 amount)'
      ]);
      const tokenCallData = erc20Interface.encodeFunctionData('transfer', [to, amount]);
      callData = saInterface.encodeFunctionData('execute', [token, 0, tokenCallData]);
    } else {
      // Native ETH Transfer
      callData = saInterface.encodeFunctionData('execute', [to, amount, '0x']);
    }

    return {
      sender: this.sender,
      nonce: '0x0', // To be fetched dynamically by the consumer
      initCode: '0x',
      callData,
      callGasLimit: '0x30d40', // 200,000
      verificationGasLimit: '0x186a0', // 100,000
      preVerificationGas: '0xc350', // 50,000
      maxFeePerGas: '0x3b9aca00', // 1 gwei
      maxPriorityFeePerGas: '0x3b9aca00',
      paymasterAndData: '0x',
      signature: '0x'
    };
  }

  /**
   * Packs the UserOperation for hashing/signing.
   */
  public pack(op: UserOperation): string {
    return ethers.AbiCoder.defaultAbiCoder().encode(
      [
        'address', 'uint256', 'bytes', 'bytes',
        'uint256', 'uint256', 'uint256', 'uint256', 'uint256',
        'bytes'
      ],
      [
        op.sender, op.nonce, op.initCode, op.callData,
        op.callGasLimit, op.verificationGasLimit, op.preVerificationGas,
        op.maxFeePerGas, op.maxPriorityFeePerGas,
        op.paymasterAndData
      ]
    );
  }
}
