import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'wouter';
import { RemixSubmission } from '@shared/dream-cloud';

interface RemixThreadData {
  originalDream: {
    id: string;
    title: string;
    creator: string;
    tags: string[];
    trustLevel: string;
    status: string;
  };
  remixes: RemixSubmission[];
}

export default function RemixThread() {
  const { dreamId } = useParams<{ dreamId: string }>();

  const { data, isLoading, error } = useQuery<RemixThreadData>({
    queryKey: ['/api/dream-clouds', dreamId, 'remixes'],
    enabled: !!dreamId
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-cyan-400 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Loading remix thread...</div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-black text-red-400 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">Failed to load remix thread</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Original Dream Context */}
        <div className="bg-gray-900 border border-cyan-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gold-400 mb-4">
            Original Dream: {data.originalDream.title}
          </h2>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Creator:</span> {data.originalDream.creator}
            </div>
            <div>
              <span className="text-gray-400">Trust Level:</span> {data.originalDream.trustLevel}
            </div>
            <div>
              <span className="text-gray-400">Status:</span> {data.originalDream.status}
            </div>
            <div>
              <span className="text-gray-400">Tags:</span> {data.originalDream.tags.join(', ')}
            </div>
          </div>
        </div>

        {/* Remix Thread */}
        <div className="remix-thread bg-gray-900 border border-cyan-500 rounded-lg p-6">
          <h3 className="text-xl font-bold text-gold-400 mb-6">🔁 Remix Thread</h3>
          
          {data.remixes.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              No remixes submitted for this dream yet.
            </div>
          ) : (
            <div className="space-y-6">
              {data.remixes.map((remix, index) => (
                <div key={remix.remixId} className="remix-entry bg-black border border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-cyan-400">
                      Remix #{index + 1}: {remix.remixId}
                    </h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      remix.status === 'pending' ? 'bg-yellow-900 text-yellow-300' :
                      remix.status === 'approved' ? 'bg-green-900 text-green-300' :
                      'bg-red-900 text-red-300'
                    }`}>
                      {remix.status.charAt(0).toUpperCase() + remix.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-2">
                        <strong className="text-gray-400">Submitted by:</strong> {remix.claimer}
                      </p>
                      <p className="mb-2">
                        <a 
                          href={remix.submission} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 underline"
                        >
                          View Submission
                        </a>
                      </p>
                      <p className="mb-2">
                        <strong className="text-gray-400">Status:</strong> {remix.status}
                      </p>
                    </div>
                    
                    <div>
                      <p className="mb-2">
                        <strong className="text-gray-400">Submitted:</strong>{' '}
                        {new Date(remix.submittedAt).toLocaleDateString()}
                      </p>
                      {remix.proof && (
                        <p className="mb-2">
                          <strong className="text-gray-400">Proof:</strong> {remix.proof}
                        </p>
                      )}
                      {remix.score && (
                        <p className="mb-2">
                          <strong className="text-gray-400">Score:</strong> {remix.score}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Remix Thread Connections */}
                  {remix.remixThread && remix.remixThread.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-400 text-sm mb-2">
                        <strong>Thread Connections:</strong>
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {remix.remixThread.map((threadId, threadIndex) => (
                          <span 
                            key={threadIndex}
                            className="px-2 py-1 bg-cyan-900 text-cyan-300 rounded text-xs"
                          >
                            {threadId}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <button 
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-black font-semibold rounded-lg transition-colors"
            onClick={() => window.history.back()}
          >
            ← Back to Dreams
          </button>
          <button 
            className="px-6 py-3 bg-gold-600 hover:bg-gold-700 text-black font-semibold rounded-lg transition-colors"
            onClick={() => {
              // Navigate to remix submission form
              window.location.href = `/remix-submission?dreamId=${dreamId}`;
            }}
          >
            Submit New Remix
          </button>
        </div>
      </div>
    </div>
  );
}