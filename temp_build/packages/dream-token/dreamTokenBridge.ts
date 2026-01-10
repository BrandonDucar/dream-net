import { randomUUID } from "node:crypto";
import { getOnchainAccount, upsertOnchainAccount, recordDreamTokenEvent } from "./store";
import { getUserBalance } from "@dreamnet/rewards-engine";
import type { DreamOnchainAccount } from "./types";

// DREAM Token contract address on Base
// Deployed to Base Mainnet: 0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77
const DREAM_TOKEN_ADDRESS = process.env.DREAM_TOKEN_ADDRESS || "0x4a6775abfD8CC67cBe9585c95C089FDc2Ae81C77";

// TODO: Wire ethers.js / viem client for Base L2
// Uncomment when ready to connect to actual contract:
// import { createPublicClient, http, createWalletClient, custom } from "viem";
// import { base } from "viem/chains";
// 
// For read operations:
// const publicClient = createPublicClient({
//   chain: base,
//   transport: http(process.env.BASE_MAINNET_RPC_URL || "https://mainnet.base.org"),
// });
//
// For write operations (minting):
// const walletClient = createWalletClient({
//   chain: base,
//   transport: custom(window.ethereum), // or use private key for server-side
// });

/**
 * Get on-chain balance for an address
 * TODO: Once DREAM ERC-20 is live on Base, call provider to fetch actual balance
 */
export async function getOnchainBalance(address: string): Promise<string> {
  // TODO: Implement real on-chain balance fetch
  // const balance = await client.readContract({
  //   address: DREAM_TOKEN_ADDRESS,
  //   abi: ERC20_ABI,
  //   functionName: "balanceOf",
  //   args: [address],
  // });
  // return balance.toString();

  // For now, return "0" as placeholder
  return "0";
}

/**
 * Request mint (for owner/admin only)
 * TODO: Once token is deployed, implement actual minting logic
 */
export async function requestMint(userId: string, amount: string): Promise<void> {
  // For now: record event and leave TODO
  await recordDreamTokenEvent({
    id: randomUUID(),
    type: "mint",
    userId,
    amount,
    createdAt: new Date().toISOString(),
    meta: { simulated: true, note: "Real minting not yet implemented" },
  });

  // TODO: Implement real minting
  // if (isOwner) {
  //   await client.writeContract({
  //     address: DREAM_TOKEN_ADDRESS,
  //     abi: ERC20_ABI,
  //     functionName: "mint",
  //     args: [toAddress, BigInt(amount)],
  //   });
  // }
}

/**
 * Request burn
 * TODO: Once token is deployed, implement actual burning logic
 */
export async function requestBurn(userId: string, amount: string): Promise<void> {
  await recordDreamTokenEvent({
    id: randomUUID(),
    type: "burn",
    userId,
    amount,
    createdAt: new Date().toISOString(),
    meta: { simulated: true, note: "Real burning not yet implemented" },
  });

  // TODO: Implement real burning
  // await client.writeContract({
  //   address: DREAM_TOKEN_ADDRESS,
  //   abi: ERC20_ABI,
  //   functionName: "burn",
  //   args: [BigInt(amount)],
  // });
}

/**
 * Sync on-chain balance for a user
 * For now: simulates by using internal rewards-engine DREAM balance
 */
export async function syncOnchainForUser(userId: string): Promise<DreamOnchainAccount> {
  const account = await getOnchainAccount(userId);
  const internalBalance = await getUserBalance(userId);

  // Simulate: use internal DREAM as "on-chain" balance for now
  // TODO: Once token is live, fetch actual on-chain balance
  if (account.baseAddress) {
    // account.onchainBalance = await getOnchainBalance(account.baseAddress);
    // For now, keep simulated balance
    account.onchainBalance = String(internalBalance.dream);
  } else {
    // No address yet, use internal balance as simulated
    account.onchainBalance = String(internalBalance.dream);
  }

  account.lastSyncedAt = new Date().toISOString();
  await upsertOnchainAccount(account);

  await recordDreamTokenEvent({
    id: randomUUID(),
    type: "sync",
    userId,
    amount: account.onchainBalance || "0",
    createdAt: new Date().toISOString(),
    meta: { simulated: true },
  });

  return account;
}

/**
 * Move internal DREAM to claimable balance (pre-mint buffer)
 */
export async function moveToClaimable(userId: string, amount: number): Promise<DreamOnchainAccount> {
  const account = await getOnchainAccount(userId);
  const internalBalance = await getUserBalance(userId);

  if (internalBalance.dream < amount) {
    throw new Error("Insufficient DREAM balance");
  }

  const claimableAmount = BigInt(account.claimableBalance || "0") + BigInt(String(amount));
  account.claimableBalance = claimableAmount.toString();
  account.lastSyncedAt = new Date().toISOString();

  await upsertOnchainAccount(account);

  await recordDreamTokenEvent({
    id: randomUUID(),
    type: "reward",
    userId,
    amount: String(amount),
    createdAt: new Date().toISOString(),
    meta: { movedToClaimable: true },
  });

  return account;
}

