import React, { useState } from 'react';

interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledAt: string;
  status: 'scheduled' | 'posted' | 'failed';
}

export function SocialOpsMini() {
  const [posts] = useState<ScheduledPost[]>([
    {
      id: '1',
      content: 'New Jaggy stealth game launched! 🐱',
      platform: 'Twitter',
      scheduledAt: new Date(Date.now() + 3600000).toISOString(),
      status: 'scheduled',
    },
    {
      id: '2',
      content: 'DreamNet Hub now live with 20+ mini-apps! 🚀',
      platform: 'Instagram',
      scheduledAt: new Date(Date.now() + 7200000).toISOString(),
      status: 'scheduled',
    },
    {
      id: '3',
      content: 'Check out our new prediction market',
      platform: 'Twitter',
      scheduledAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'posted',
    },
  ]);

  const [metrics] = useState({
    impressions: 45230,
    clicks: 1234,
    engagement: 8.5,
    reach: 28900,
  });

  const handleBoost = () => {
    // TODO: Call /api/social-ops/boost
    alert('Boost initiated!\n\nTODO: Connect to social media API');
  };

  const handleRotate = () => {
    // TODO: Call /api/social-ops/rotate-campaign
    alert('Campaign rotated!\n\nTODO: Connect to campaign rotation logic');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 border border-cyan-500/20">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            📱 Social Ops Mini
          </h1>
          <p className="text-gray-400 mb-6">Manage social media automations and campaigns</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Impressions</h3>
              <div className="text-2xl font-bold">{metrics.impressions.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Clicks</h3>
              <div className="text-2xl font-bold">{metrics.clicks.toLocaleString()}</div>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Engagement</h3>
              <div className="text-2xl font-bold">{metrics.engagement}%</div>
            </div>
            <div className="p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <h3 className="text-sm font-semibold text-gray-400 mb-1">Reach</h3>
              <div className="text-2xl font-bold">{metrics.reach.toLocaleString()}</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleBoost}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Boost Next Jaggy Reel
              </button>
              <button
                onClick={handleRotate}
                className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Rotate Campaign
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Posts</h2>
            <div className="space-y-2">
              {posts.map(post => (
                <div
                  key={post.id}
                  className={`p-4 rounded-lg border-2 ${
                    post.status === 'scheduled'
                      ? 'bg-gray-700/50 border-cyan-500/30'
                      : post.status === 'posted'
                      ? 'bg-green-500/10 border-green-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-gray-300">{post.content}</p>
                      <div className="flex gap-2 mt-2 text-xs text-gray-400">
                        <span>{post.platform}</span>
                        <span>•</span>
                        <span>
                          {post.status === 'scheduled'
                            ? `Scheduled: ${new Date(post.scheduledAt).toLocaleString()}`
                            : `Posted: ${new Date(post.scheduledAt).toLocaleString()}`}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded capitalize ${
                        post.status === 'scheduled'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : post.status === 'posted'
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {post.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
            <p className="text-sm text-gray-400">
              📝 TODO: Connect to /api/social-ops/posts for real scheduled posts
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Wire boost/rotate buttons to social media automation APIs
            </p>
            <p className="text-sm text-gray-400 mt-1">
              📝 TODO: Fetch real metrics from social media platforms
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

