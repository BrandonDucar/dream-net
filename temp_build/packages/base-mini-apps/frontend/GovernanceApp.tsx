import React, { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';

interface GovernanceAppProps {
  governanceContractAddress: string;
  passportContractAddress: string;
}

interface Proposal {
  id: number;
  title: string;
  description: string;
  proposer: string;
  votesFor: bigint;
  votesAgainst: bigint;
  executed: boolean;
}

export function GovernanceApp({ governanceContractAddress, passportContractAddress }: GovernanceAppProps) {
  const { address, isConnected } = useAccount();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [newProposal, setNewProposal] = useState({ title: '', description: '' });

  const { writeContract } = useWriteContract();

  // Check if user has passport
  const { data: hasPassport } = useReadContract({
    address: passportContractAddress as `0x${string}`,
    abi: [
      {
        name: 'hasPassport',
        type: 'function',
        stateMutability: 'view',
        inputs: [{ name: 'user', type: 'address' }],
        outputs: [{ name: '', type: 'bool' }],
      },
    ],
    functionName: 'hasPassport',
    args: [address!],
    query: { enabled: !!address },
  });

  const createProposal = async () => {
    if (!isConnected || !address) return;

    try {
      await writeContract({
        address: governanceContractAddress as `0x${string}`,
        abi: [
          {
            name: 'createProposal',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'title', type: 'string' },
              { name: 'description', type: 'string' },
              { name: 'votingDuration', type: 'uint256' },
            ],
            outputs: [{ name: '', type: 'uint256' }],
          },
        ],
        functionName: 'createProposal',
        args: [newProposal.title, newProposal.description, 7 * 24 * 60 * 60], // 7 days
      });
      setNewProposal({ title: '', description: '' });
    } catch (error) {
      console.error('Create proposal failed:', error);
    }
  };

  const castVote = async (proposalId: number, support: boolean) => {
    if (!isConnected) return;

    try {
      await writeContract({
        address: governanceContractAddress as `0x${string}`,
        abi: [
          {
            name: 'castVote',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'proposalId', type: 'uint256' },
              { name: 'support', type: 'bool' },
            ],
            outputs: [],
          },
        ],
        functionName: 'castVote',
        args: [BigInt(proposalId), support],
      });
    } catch (error) {
      console.error('Vote failed:', error);
    }
  };

  if (!isConnected) {
    return <div>Connect your wallet to participate in governance</div>;
  }

  if (!hasPassport) {
    return <div>You need a Dream State passport to participate. Mint one first!</div>;
  }

  return (
    <div className="miniapp-governance">
      <div className="app-header">
        <h1>🏛️ Dream State Governance</h1>
        <p>Vote on proposals and shape Dream State</p>
      </div>

      <div className="create-proposal">
        <h2>Create Proposal</h2>
        <input
          type="text"
          placeholder="Proposal Title"
          value={newProposal.title}
          onChange={(e) => setNewProposal({ ...newProposal, title: e.target.value })}
        />
        <textarea
          placeholder="Proposal Description"
          value={newProposal.description}
          onChange={(e) => setNewProposal({ ...newProposal, description: e.target.value })}
        />
        <button onClick={createProposal}>Create Proposal</button>
      </div>

      <div className="proposals-list">
        <h2>Active Proposals</h2>
        {proposals.map((proposal) => (
          <div key={proposal.id} className="proposal-card">
            <h3>{proposal.title}</h3>
            <p>{proposal.description}</p>
            <div className="votes">
              <span>For: {proposal.votesFor.toString()}</span>
              <span>Against: {proposal.votesAgainst.toString()}</span>
            </div>
            <div className="vote-buttons">
              <button onClick={() => castVote(proposal.id, true)}>Vote For</button>
              <button onClick={() => castVote(proposal.id, false)}>Vote Against</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

