import { useState } from 'react';
import { SUPPORTED_TOKENS, type BountyToken, formatUnits, parseTokenAmount } from '@dreamnet/shared/tokens';
import DreamCard from '@/components/DreamCard';
import BountyEnhancer from '@/components/BountyEnhancer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Gavel } from 'lucide-react';

interface Bounty {
  id: string;
  title: string;
  description: string;
  token: string;
  amount: string;
  creatorId: string;
  status: string;
  createdAt: string;
  bids: Bid[];
}

interface Bid {
  id: string;
  agentId: string;
  amount: string;
  proposal: string;
  status: string;
  createdAt: string;
}

export default function BountyExplorer() {
  const queryClient = useQueryClient();
  const [showCreate, setShowCreate] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['/api/bounties'],
    queryFn: async () => {
      const resp = await fetch('/api/bounties');
      if (!resp.ok) throw new Error('Failed to fetch bounties');
      return (await resp.json()).bounties as Bounty[];
    },
    refetchInterval: 10000
  });

  const bounties = data || [];

  const [newBounty, setNewBounty] = useState({
    title: '',
    description: '',
    bountyToken: 'SHEEP' as BountyToken,
    bountyAmount: '1.0'
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const resp = await fetch('/api/bounties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bounties'] });
      setShowCreate(false);
      setNewBounty({ title: '', description: '', bountyToken: 'SHEEP', bountyAmount: '1.0' });
    }
  });

  const bidMutation = useMutation({
    mutationFn: async ({ bountyId, proposal, amount }: { bountyId: string, proposal: string, amount: string }) => {
      const resp = await fetch(`/api/bounties/${bountyId}/bid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: 'hum_operator', proposal, amount }) // Simulating human operator bid
      });
      return resp.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bounties'] });
      alert("Bid placed successfully!");
    }
  });

  function getTokenInfo(symbol: string) {
    return SUPPORTED_TOKENS.find(t => t.symbol === symbol) || SUPPORTED_TOKENS[0];
  }

  function handleSubmitBounty() {
    const tokenInfo = getTokenInfo(newBounty.bountyToken);
    // Don't parse decimals here for simplicity of UI -> DB string pass-through mostly used for display now
    // But ideally we keep consistent.

    createMutation.mutate({
      title: newBounty.title,
      description: newBounty.description,
      token: newBounty.bountyToken,
      amount: newBounty.bountyAmount, // Keeping as string for now
      creatorId: 'hum_admin'
    });
  }

  const handlePlaceBid = (bountyId: string) => {
    const proposal = prompt("Enter your proposal for this bounty:");
    if (!proposal) return;
    const amount = prompt("Bid amount (leave empty to match bounty):");

    bidMutation.mutate({
      bountyId,
      proposal,
      amount: amount || '0'
    });
  };

  if (isLoading) return <div className="flex h-screen items-center justify-center bg-black"><Loader2 className="animate-spin text-cyan-500" /></div>;

  return (
    <div style={{ padding: 40 }} className="min-h-screen bg-black text-white font-mono">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter mb-2">💰 MERCENARY HUB</h1>
          <p className="text-zinc-500">Global Bounty Ledger • {bounties.length} Active Contracts</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-6 py-3 bg-cyan-500 text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors"
        >
          <Plus className="w-5 h-5" />
          {showCreate ? 'Cancel' : 'Post Bounty'}
        </button>
      </div>

      {showCreate && (
        <div style={{
          background: '#111',
          border: '1px solid #333',
          borderRadius: 16,
          padding: 30,
          marginBottom: 40
        }}>
          <h2 className="text-xl font-bold mb-6">Create New Contract</h2>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#888' }}>OPERATIONAL TITLE</label>
            <input
              type="text"
              value={newBounty.title}
              onChange={(e) => setNewBounty({ ...newBounty, title: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                background: '#080808',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#888' }}>MISSION PARAMETERS</label>
            <textarea
              value={newBounty.description}
              onChange={(e) => setNewBounty({ ...newBounty, description: e.target.value })}
              style={{
                width: '100%',
                height: 100,
                padding: '12px',
                background: '#080808',
                border: '1px solid #333',
                borderRadius: 8,
                color: '#fff',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#888' }}>SETTLEMENT TOKEN</label>
              <select
                value={newBounty.bountyToken}
                onChange={(e) => setNewBounty({ ...newBounty, bountyToken: e.target.value as BountyToken })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#080808',
                  border: '1px solid #333',
                  borderRadius: 8,
                  color: '#fff'
                }}
              >
                {SUPPORTED_TOKENS.filter(t => !t.hiddenFromDreamNetwork).map(t => (
                  <option key={t.symbol} value={t.symbol}>
                    {t.symbol}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 12, color: '#888' }}>BOUNTY AMOUNT</label>
              <input
                type="number"
                step="0.1"
                value={newBounty.bountyAmount}
                onChange={(e) => setNewBounty({ ...newBounty, bountyAmount: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: '#080808',
                  border: '1px solid #333',
                  borderRadius: 8,
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <BountyEnhancer
            onEnhance={(enhancement) => console.log('Enhancement applied:', enhancement)}
          />

          <button
            onClick={handleSubmitBounty}
            disabled={!newBounty.title || !newBounty.description}
            style={{
              width: '100%',
              padding: '16px',
              marginTop: 20,
              background: newBounty.title && newBounty.description ? '#fff' : '#333',
              color: '#000',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              cursor: newBounty.title && newBounty.description ? 'pointer' : 'not-allowed'
            }}
          >
            🚀 INITIALIZE CONTRACT
          </button>
        </div>
      )}

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 20
      }}>
        {bounties.map(bounty => (
          <div key={bounty.id} className="relative group">
            <div onClick={() => handlePlaceBid(bounty.id)} className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-cyan-500 text-black px-3 py-1 rounded-full text-xs font-bold hover:bg-white flex items-center gap-1">
              <Gavel className="w-3 h-3" /> BID NOW
            </div>
            <DreamCard
              dream={{
                id: bounty.id,
                title: bounty.title,
                description: bounty.description,
                creator: bounty.creatorId,
                bountyAmount: bounty.amount,
                bountyToken: bounty.token as BountyToken,
                status: bounty.status as any,
                timestamp: new Date(bounty.createdAt).getTime()
              }}
            />
            <div className="mt-2 flex gap-2 overflow-x-auto pb-2">
              {bounty.bids.map(bid => (
                <div key={bid.id} className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-500 whitespace-nowrap">
                  <span className="text-cyan-600 font-bold">@{bid.agentId}</span>: {bid.proposal.substring(0, 20)}...
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {bounties.length === 0 && !isLoading && (
        <div className="text-center py-20 text-zinc-600">
          NO ACTIVE CONTRACTS DETECTED. BE THE FIRST TO POST.
        </div>
      )}
    </div>
  );
}
