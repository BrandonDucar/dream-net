/**
 * Stake SPK Client - Helper for staking SPK to get stSPK
 * 
 * This is the first step: SPK → stSPK before adding to LP
 */

import { ethers } from 'ethers';

export interface StakeConfig {
  stSPKContractAddress: string;
  spkTokenAddress: string;
  lockDuration?: number; // Optional lock in seconds (0 = no lock)
}

/**
 * Stake SPK Client - Handles staking SPK to receive stSPK
 */
export class StakeSPKClient {
  private provider: ethers.Provider;
  private signer?: ethers.Signer;
  private stSPKContract: ethers.Contract;
  private spkTokenContract: ethers.Contract;

  constructor(
    config: StakeConfig,
    provider: ethers.Provider,
    signer?: ethers.Signer
  ) {
    this.provider = provider;
    this.signer = signer;

    // StakedSPK contract ABI
    const stSPKABI = [
      'function stake(uint256 amount, uint256 lockDuration)',
      'function unstake(uint256 amount)',
      'function claimRewards()',
      'function balanceOf(address account) view returns (uint256)',
      'function totalStaked() view returns (uint256)',
      'function earned(address account) view returns (uint256)',
      'function lockUntil(address account) view returns (uint256)',
    ];

    // SPK token ABI (standard ERC20)
    const spkABI = [
      'function approve(address spender, uint256 amount) returns (bool)',
      'function balanceOf(address account) view returns (uint256)',
      'function allowance(address owner, address spender) view returns (uint256)',
    ];

    this.stSPKContract = new ethers.Contract(
      config.stSPKContractAddress,
      stSPKABI,
      signer || provider
    );

    this.spkTokenContract = new ethers.Contract(
      config.spkTokenAddress,
      spkABI,
      signer || provider
    );
  }

  /**
   * Check SPK balance
   */
  async getSPKBalance(address?: string): Promise<bigint> {
    const addr = address || (this.signer ? await this.signer.getAddress() : undefined);
    if (!addr) throw new Error('Address required');

    return await this.spkTokenContract.balanceOf(addr);
  }

  /**
   * Check stSPK balance
   */
  async getStSPKBalance(address?: string): Promise<bigint> {
    const addr = address || (this.signer ? await this.signer.getAddress() : undefined);
    if (!addr) throw new Error('Address required');

    return await this.stSPKContract.balanceOf(addr);
  }

  /**
   * Check if SPK is approved for staking
   */
  async checkApproval(amount: bigint): Promise<boolean> {
    if (!this.signer) throw new Error('Signer required');

    const address = await this.signer.getAddress();
    const stSPKAddress = await this.stSPKContract.getAddress();
    const allowance = await this.spkTokenContract.allowance(address, stSPKAddress);

    return allowance >= amount;
  }

  /**
   * Approve SPK for staking
   */
  async approveSPK(amount: bigint): Promise<{ txHash: string }> {
    if (!this.signer) throw new Error('Signer required');

    const stSPKAddress = await this.stSPKContract.getAddress();
    const tx = await this.spkTokenContract.approve(stSPKAddress, amount);
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  }

  /**
   * Stake SPK to get stSPK
   * 
   * Flow:
   * 1. Check SPK balance
   * 2. Approve SPK if needed
   * 3. Call stake() on StakedSPK contract
   * 4. Receive stSPK receipt tokens
   */
  async stakeSPK(
    amount: bigint,
    lockDuration: number = 0
  ): Promise<{ txHash: string; stSPKReceived: bigint }> {
    if (!this.signer) throw new Error('Signer required');

    // Check balance
    const balance = await this.getSPKBalance();
    if (balance < amount) {
      throw new Error(`Insufficient SPK balance: ${balance} < ${amount}`);
    }

    // Check and approve if needed
    const isApproved = await this.checkApproval(amount);
    if (!isApproved) {
      console.log('Approving SPK for staking...');
      await this.approveSPK(amount);
    }

    // Stake SPK
    console.log(`Staking ${ethers.formatEther(amount)} SPK (lock: ${lockDuration}s)...`);
    const tx = await this.stSPKContract.stake(amount, lockDuration);
    const receipt = await tx.wait();

    // Get stSPK balance after staking
    const stSPKBalance = await this.getStSPKBalance();

    return {
      txHash: receipt.hash,
      stSPKReceived: stSPKBalance,
    };
  }

  /**
   * Unstake stSPK back to SPK (if not locked)
   */
  async unstakeSPK(amount: bigint): Promise<{ txHash: string; spkReceived: bigint }> {
    if (!this.signer) throw new Error('Signer required');

    // Check stSPK balance
    const balance = await this.getStSPKBalance();
    if (balance < amount) {
      throw new Error(`Insufficient stSPK balance: ${balance} < ${amount}`);
    }

    // Check lock status
    const address = await this.signer.getAddress();
    const lockUntil = await this.stSPKContract.lockUntil(address);
    const now = BigInt(Math.floor(Date.now() / 1000));

    if (lockUntil > now) {
      const unlockTime = new Date(Number(lockUntil) * 1000);
      throw new Error(`Tokens locked until ${unlockTime.toISOString()}`);
    }

    // Unstake
    const tx = await this.stSPKContract.unstake(amount);
    const receipt = await tx.wait();

    // Get SPK balance after unstaking
    const spkBalance = await this.getSPKBalance();

    return {
      txHash: receipt.hash,
      spkReceived: spkBalance,
    };
  }

  /**
   * Claim staking rewards (auto-compounds into more stSPK)
   */
  async claimRewards(): Promise<{ txHash: string }> {
    if (!this.signer) throw new Error('Signer required');

    const tx = await this.stSPKContract.claimRewards();
    const receipt = await tx.wait();

    return { txHash: receipt.hash };
  }

  /**
   * Check earned rewards
   */
  async getEarnedRewards(address?: string): Promise<bigint> {
    const addr = address || (this.signer ? await this.signer.getAddress() : undefined);
    if (!addr) throw new Error('Address required');

    return await this.stSPKContract.earned(addr);
  }
}

