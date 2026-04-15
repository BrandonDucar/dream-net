import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface RemixSubmission {
  dreamId: string;
  wallet: string;
  remixText: string;
  tags: string[];
  components: string[];
  submitTime: number;
}

interface RemixResult {
  success: boolean;
  remixId: string;
  score: number;
  bountyAwarded: {
    token: string;
    amount: number;
    bonus: number;
  };
  status: string;
  purificationLevel: number;
}

export default function RemixSubmission() {
  const [dreamId, setDreamId] = useState('7b3d');
  const [wallet, setWallet] = useState('0xDEF');
  const [remixText, setRemixText] = useState('I stabilized the portal by adding AI fallback logic.');
  const [tags, setTags] = useState('defi,ai,stability');
  const [components, setComponents] = useState('canvas,lucid');
  const [result, setResult] = useState<RemixResult | null>(null);
  
  const queryClient = useQueryClient();

  // Fetch existing remixes for a dream
  const { data: remixesData } = useQuery<{
    success: boolean;
    dreamId: string;
    submissions: Array<RemixSubmission & { result?: RemixResult }>;
    totalSubmissions: number;
  }>({
    queryKey: ['/api/dreams', dreamId, 'remixes'],
    enabled: !!dreamId
  });

  // Submit remix mutation
  const submitRemix = useMutation({
    mutationFn: async (submission: Omit<RemixSubmission, 'submitTime'>) => {
      const response = await apiRequest(`/api/dreams/${submission.dreamId}/remix`, {
        method: 'POST',
        body: JSON.stringify({
          ...submission,
          submitTime: Date.now()
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response as unknown as {
        success: boolean;
        submission: RemixSubmission;
        result: RemixResult;
      };
    },
    onSuccess: (data) => {
      setResult(data.result);
      queryClient.invalidateQueries({ queryKey: ['/api/dreams'] });
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem'] });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission = {
      dreamId,
      wallet,
      remixText,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      components: components.split(',').map(c => c.trim()).filter(Boolean)
    };
    
    submitRemix.mutate(submission);
  };

  // Process the provided remix data automatically
  const processProvidedRemix = () => {
    const providedSubmission = {
      dreamId: '7b3d',
      wallet: '0xDEF',
      remixText: 'I stabilized the portal by adding AI fallback logic.',
      tags: ['defi', 'ai', 'stability'],
      components: ['canvas', 'lucid']
    };
    
    submitRemix.mutate(providedSubmission);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Dream Remix Submission</h1>
        <p className="text-gray-400">
          Submit remixes for infected dreams to earn bounties and help purify the ecosystem
        </p>
      </div>

      {/* Quick Process Button */}
      <div className="mb-6 p-4 bg-gray-900 border border-cyan-400 rounded-lg">
        <h2 className="text-lg font-semibold text-cyan-400 mb-2">Process Provided Remix</h2>
        <p className="text-gray-300 mb-3">
          Process the remix submission for dream 7b3d with the exact data structure you provided
        </p>
        <button
          onClick={processProvidedRemix}
          disabled={submitRemix.isPending}
          className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white px-4 py-2 rounded"
        >
          {submitRemix.isPending ? 'Processing...' : 'Process Remix (7b3d)'}
        </button>
      </div>

      {/* Manual Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Dream ID
            </label>
            <input
              type="text"
              value={dreamId}
              onChange={(e) => setDreamId(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-400"
              placeholder="e.g., 7b3d"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Wallet Address
            </label>
            <input
              type="text"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-400"
              placeholder="0xDEF"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Remix Description
          </label>
          <textarea
            value={remixText}
            onChange={(e) => setRemixText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-400"
            placeholder="Describe your remix and improvements..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-400"
              placeholder="defi,ai,stability"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Components (comma-separated)
            </label>
            <input
              type="text"
              value={components}
              onChange={(e) => setComponents(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white focus:border-cyan-400"
              placeholder="canvas,lucid"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitRemix.isPending}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white py-2 px-4 rounded"
        >
          {submitRemix.isPending ? 'Submitting...' : 'Submit Remix'}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="bg-gray-900 border border-green-400 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-green-400 mb-4">Remix Processed Successfully!</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Results</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">Remix ID: <span className="text-cyan-400">{result.remixId}</span></div>
                <div className="text-gray-300">Score: <span className="text-green-400">{result.score}/100</span></div>
                <div className="text-gray-300">Status: <span className="text-green-400">{result.status}</span></div>
                <div className="text-gray-300">Purification: <span className="text-green-400">{result.purificationLevel}%</span></div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Bounty Awarded</h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">Token: <span className="text-yellow-400">{result.bountyAwarded.token}</span></div>
                <div className="text-gray-300">Amount: <span className="text-yellow-400">{result.bountyAwarded.amount}</span></div>
                <div className="text-gray-300">Bonus: <span className="text-yellow-400">+{result.bountyAwarded.bonus}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Remixes */}
      {remixesData && remixesData.submissions.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Previous Submissions</h2>
          <div className="space-y-4">
            {remixesData.submissions.map((submission, index) => (
              <div key={index} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-cyan-400 font-mono">{submission.wallet}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(submission.submitTime).toLocaleString()}
                  </span>
                </div>
                
                <p className="text-gray-300 mb-2">{submission.remixText}</p>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {submission.tags.map(tag => (
                    <span key={tag} className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                
                {submission.result && (
                  <div className="bg-gray-800 rounded p-2 mt-2">
                    <div className="text-sm text-gray-300">
                      Score: {submission.result.score} • 
                      Status: {submission.result.status} • 
                      Bounty: {submission.result.bountyAwarded.amount} {submission.result.bountyAwarded.token}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}