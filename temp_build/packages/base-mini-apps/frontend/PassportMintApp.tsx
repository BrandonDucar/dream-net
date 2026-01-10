import React, { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';

interface PassportMintAppProps {
  passportContractAddress: string;
}

export function PassportMintApp({ passportContractAddress }: PassportMintAppProps) {
  const { address, isConnected } = useAccount();
  const [tier, setTier] = useState<string>('dreamer');
  const [flags, setFlags] = useState<string[]>([]);

  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    if (!isConnected || !address) return;

    const tierMap: Record<string, number> = {
      visitor: 0,
      dreamer: 1,
      citizen: 2,
      operator: 3,
      architect: 4,
      founder: 5,
    };

    try {
      await writeContract({
        address: passportContractAddress as `0x${string}`,
        abi: [
          {
            name: 'mintPassport',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'tier', type: 'uint8' },
              { name: 'flags', type: 'string[]' },
            ],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'mintPassport',
        args: [address, tierMap[tier], flags],
      });
    } catch (error) {
      console.error('Mint failed:', error);
    }
  };

  return (
    <div className="miniapp-passport-mint">
      <div className="app-header">
        <h1>🪪 Dream Passport Mint</h1>
        <p>Mint your Dream State passport NFT on Base</p>
      </div>

      {!isConnected ? (
        <div className="connect-prompt">
          <p>Connect your wallet to mint a passport</p>
        </div>
      ) : (
        <div className="mint-form">
          <div className="form-group">
            <label>Passport Tier</label>
            <select value={tier} onChange={(e) => setTier(e.target.value)}>
              <option value="visitor">Visitor</option>
              <option value="dreamer">Dreamer</option>
              <option value="citizen">Citizen</option>
              <option value="operator">Operator</option>
              <option value="architect">Architect</option>
              <option value="founder">Founder</option>
            </select>
          </div>

          <div className="form-group">
            <label>Flags (comma-separated)</label>
            <input
              type="text"
              placeholder="early, trusted, builder"
              onChange={(e) => setFlags(e.target.value.split(',').map(f => f.trim()))}
            />
          </div>

          <button
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="mint-button"
          >
            {isPending ? 'Confirming...' : isConfirming ? 'Minting...' : 'Mint Passport'}
          </button>

          {isSuccess && (
            <div className="success-message">
              ✅ Passport minted! Transaction: {hash}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

