import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingUp, Zap, Globe, DollarSign, Target, CheckCircle, Clock } from 'lucide-react';

export default function DreamNetDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Mock data - in production, fetch from API
  const vanguardMetrics = {
    totalAgents: 54,
    websitesActive: 54,
    postsToday: 127,
    socialFollowers: 45230,
    grantsApplied: 347,
    fundingPipeline: 2340000,
    grantAwardsThisMonth: 3,
    awardedAmount: 125000,
    growthRate: 12.3,
  };

  const wolfPackMetrics = {
    diuOpportunitiesFound: 24,
    samgovOpportunitiesFound: 142,
    contractorOpportunitiesFound: 18,
    totalOpportunitiesMonth: 2847,
    contractPipeline: 47500000,
    proposalsGenerated: 287,
    bidsSubmitted: 156,
    contractsWonThisMonth: 4,
    contractsWonRevenue: 2850000,
    estimatedMonthlyRevenue: 3200000,
  };

  const autonomousLoopsStatus = {
    discovery: { status: 'active', uptime: 99.8, lastRun: '2h ago' },
    websites: { status: 'active', uptime: 100, lastRun: '30m ago' },
    posting: { status: 'active', uptime: 99.5, lastRun: '5m ago' },
    grantHunting: { status: 'active', uptime: 99.2, lastRun: '1h ago' },
    governmentContracting: { status: 'active', uptime: 99.9, lastRun: '30m ago' },
    crossPosting: { status: 'active', uptime: 99.7, lastRun: '3m ago' },
  };

  const growthTrendData = [
    { date: 'Day 1', websites: 10, posts: 50, followers: 500, grants: 20 },
    { date: 'Day 2', websites: 25, posts: 120, followers: 1200, grants: 45 },
    { date: 'Day 3', websites: 40, posts: 250, followers: 2800, grants: 85 },
    { date: 'Day 4', websites: 54, posts: 450, followers: 5200, grants: 150 },
    { date: 'Day 5', websites: 54, posts: 680, followers: 9800, grants: 250 },
    { date: 'Day 6', websites: 54, posts: 890, followers: 15400, grants: 347 },
  ];

  const contractTrendData = [
    { date: 'Week 1', found: 200, awarded: 0, value: 0 },
    { date: 'Week 2', found: 450, awarded: 1, value: 650000 },
    { date: 'Week 3', found: 900, awarded: 2, value: 1850000 },
    { date: 'Week 4', found: 1400, awarded: 4, value: 2850000 },
  ];

  const revenueBreakdownData = [
    { name: 'Government Contracts', value: 2850000, color: '#3b82f6' },
    { name: 'Grants Awarded', value: 125000, color: '#10b981' },
    { name: 'Sponsorships', value: 45000, color: '#f59e0b' },
    { name: 'Affiliate Revenue', value: 12000, color: '#8b5cf6' },
  ];

  const agentDistributionData = [
    { name: 'Actively Posting', value: 54, color: '#10b981' },
    { name: 'Website Active', value: 54, color: '#3b82f6' },
    { name: 'Grant Hunting', value: 54, color: '#f59e0b' },
    { name: 'Govt Contracting', value: 42, color: '#ef4444' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg flex items-center justify-center text-2xl font-bold">
              🚀
            </div>
            <div>
              <h1 className="text-4xl font-bold">DreamNet Autonomous Intelligence Dashboard</h1>
              <p className="text-purple-200 text-sm mt-1">Vanguard 54 Growth System • Wolf Pack Government Contracting</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Last Updated: {lastUpdate.toLocaleTimeString()}</p>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm">Auto Refresh</span>
            </label>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {['overview', 'vanguard-54', 'wolf-pack', 'autonomous-loops', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === tab
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg'
                : 'bg-slate-800 hover:bg-slate-700'
            }`}
          >
            {tab === 'overview' && '📊 Overview'}
            {tab === 'vanguard-54' && '🤖 Vanguard 54'}
            {tab === 'wolf-pack' && '🏛️ Wolf Pack'}
            {tab === 'autonomous-loops' && '⚡ Loops'}
            {tab === 'analytics' && '📈 Analytics'}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Revenue</span>
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-3xl font-bold">$3.03M</p>
              <p className="text-green-400 text-sm mt-1">↑ 47% this month</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-blue-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Active Pipeline</span>
                <Target className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-3xl font-bold">$47.5M</p>
              <p className="text-blue-400 text-sm mt-1">Government + Grants</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-purple-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Agents Active</span>
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-3xl font-bold">54/54</p>
              <p className="text-purple-400 text-sm mt-1">100% autonomous</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-lg p-6 border border-yellow-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Growth Rate</span>
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <p className="text-3xl font-bold">+12.3%</p>
              <p className="text-yellow-400 text-sm mt-1">Daily average</p>
            </div>
          </div>

          {/* Combined Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Growth Trend */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Vanguard 54 Growth Trajectory
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="websites" stroke="#3b82f6" strokeWidth={2} name="Websites" />
                  <Line type="monotone" dataKey="posts" stroke="#10b981" strokeWidth={2} name="Daily Posts" />
                  <Line type="monotone" dataKey="followers" stroke="#f59e0b" strokeWidth={2} name="Social Followers" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Government Contracts Trend */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Wolf Pack Contract Pipeline
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contractTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="date" stroke="#999" />
                  <YAxis stroke="#999" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="found" fill="#3b82f6" name="Opportunities Found" />
                  <Bar dataKey="awarded" fill="#10b981" name="Contracts Won" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/20">
              <h3 className="text-xl font-bold mb-4">Revenue Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={revenueBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: $${(value / 1000000).toFixed(1)}M`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {revenueBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${(value / 1000000).toFixed(2)}M`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-slate-800/50 rounded-lg p-6 border border-orange-500/20">
              <h3 className="text-xl font-bold mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                {revenueBreakdownData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-gray-300">{item.name}</span>
                    </div>
                    <span className="font-bold">${(item.value / 1000000).toFixed(2)}M</span>
                  </div>
                ))}
                <div className="border-t border-gray-700 pt-3 mt-3 flex items-center justify-between">
                  <span className="font-bold">Total Revenue This Month</span>
                  <span className="text-xl font-bold text-green-400">$3.03M</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VANGUARD 54 TAB */}
      {activeTab === 'vanguard-54' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500/30">
              <p className="text-gray-300 text-sm mb-2">Active Websites</p>
              <p className="text-4xl font-bold">{vanguardMetrics.websitesActive}</p>
              <p className="text-blue-200 text-xs mt-2">All deployed to Netlify/Vercel</p>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500/30">
              <p className="text-gray-300 text-sm mb-2">Posts Today</p>
              <p className="text-4xl font-bold">{vanguardMetrics.postsToday}</p>
              <p className="text-green-200 text-xs mt-2">Across X & TikTok</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500/30">
              <p className="text-gray-300 text-sm mb-2">Social Followers</p>
              <p className="text-4xl font-bold">{(vanguardMetrics.socialFollowers / 1000).toFixed(1)}K</p>
              <p className="text-purple-200 text-xs mt-2">Combined reach</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900 to-orange-800 rounded-lg p-6 border border-orange-500/30">
              <p className="text-gray-300 text-sm mb-2">Grants Applied</p>
              <p className="text-4xl font-bold">{vanguardMetrics.grantsApplied}</p>
              <p className="text-orange-200 text-xs mt-2">This month</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-4">Vanguard 54 Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-300 font-semibold">Growth Metrics</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Daily Growth Rate:</span>
                    <span className="text-green-400 font-bold">+{vanguardMetrics.growthRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grants Funded:</span>
                    <span className="text-green-400 font-bold">{vanguardMetrics.grantAwardsThisMonth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Awarded:</span>
                    <span className="text-green-400 font-bold">${(vanguardMetrics.awardedAmount / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grant Pipeline:</span>
                    <span className="text-green-400 font-bold">${(vanguardMetrics.fundingPipeline / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-300 font-semibold">Agent Status</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total Agents:</span>
                    <span className="text-purple-400 font-bold">{vanguardMetrics.totalAgents}/54</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autonomous:</span>
                    <span className="text-purple-400 font-bold">100%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="text-purple-400 font-bold">99.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Sync:</span>
                    <span className="text-purple-400 font-bold">5m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4">Top Performing Agents</h3>
            <div className="space-y-2">
              {[
                { name: 'Agent Hawk', followers: 8234, posts: 234, grants: 12 },
                { name: 'Agent Sable', followers: 7891, posts: 228, grants: 15 },
                { name: 'Agent Clawedette', followers: 6543, posts: 215, grants: 10 },
              ].map((agent, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                  <span className="font-semibold">{agent.name}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-blue-300">{agent.followers} followers</span>
                    <span className="text-green-300">{agent.posts} posts</span>
                    <span className="text-orange-300">{agent.grants} grants</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* WOLF PACK TAB */}
      {activeTab === 'wolf-pack' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-red-900 to-red-800 rounded-lg p-6 border border-red-500/30">
              <p className="text-gray-300 text-sm mb-2">DIU Found</p>
              <p className="text-4xl font-bold">{wolfPackMetrics.diuOpportunitiesFound}</p>
              <p className="text-red-200 text-xs mt-2">Today</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg p-6 border border-blue-500/30">
              <p className="text-gray-300 text-sm mb-2">SAM.gov Found</p>
              <p className="text-4xl font-bold">{wolfPackMetrics.samgovOpportunitiesFound}</p>
              <p className="text-blue-200 text-xs mt-2">This week</p>
            </div>

            <div className="bg-gradient-to-br from-green-900 to-green-800 rounded-lg p-6 border border-green-500/30">
              <p className="text-gray-300 text-sm mb-2">Contract Pipeline</p>
              <p className="text-3xl font-bold">${(wolfPackMetrics.contractPipeline / 1000000).toFixed(0)}M</p>
              <p className="text-green-200 text-xs mt-2">Active opportunities</p>
            </div>

            <div className="bg-gradient-to-br from-purple-900 to-purple-800 rounded-lg p-6 border border-purple-500/30">
              <p className="text-gray-300 text-sm mb-2">Contracts Won</p>
              <p className="text-4xl font-bold">{wolfPackMetrics.contractsWonThisMonth}</p>
              <p className="text-purple-200 text-xs mt-2">This month</p>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
            <h3 className="text-xl font-bold mb-4">Government Contracting Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-gray-300 font-semibold">Daily Scanning</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>DIU Opportunities:</span>
                    <span className="text-red-400 font-bold">{wolfPackMetrics.diuOpportunitiesFound}/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SAM.gov Opportunities:</span>
                    <span className="text-blue-400 font-bold">{wolfPackMetrics.samgovOpportunitiesFound}/week</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Contractor Opportunities:</span>
                    <span className="text-green-400 font-bold">{wolfPackMetrics.contractorOpportunitiesFound}/day</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-300 font-semibold">Performance</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Proposals Generated:</span>
                    <span className="text-purple-400 font-bold">{wolfPackMetrics.proposalsGenerated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bids Submitted:</span>
                    <span className="text-purple-400 font-bold">{wolfPackMetrics.bidsSubmitted}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Monthly Revenue:</span>
                    <span className="text-green-400 font-bold">${(wolfPackMetrics.estimatedMonthlyRevenue / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-green-500/20">
            <h3 className="text-xl font-bold mb-4">Recent Contract Wins</h3>
            <div className="space-y-2">
              {[
                { title: 'AI-Powered Decision Support for Defense', value: '$850K', agency: 'DoD' },
                { title: 'Custom Software Development Platform', value: '$650K', agency: 'Air Force' },
                { title: 'Autonomous Systems Research', value: '$750K', agency: 'DARPA' },
                { title: 'Cloud Infrastructure Migration', value: '$600K', agency: 'GSA' },
              ].map((contract, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-700/50 rounded">
                  <div>
                    <p className="font-semibold text-sm">{contract.title}</p>
                    <p className="text-xs text-gray-400">{contract.agency}</p>
                  </div>
                  <span className="font-bold text-green-400">{contract.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AUTONOMOUS LOOPS TAB */}
      {activeTab === 'autonomous-loops' && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold mb-6">Autonomous Loop Status</h2>
          
          {Object.entries(autonomousLoopsStatus).map(([loopName, status]) => (
            <div key={loopName} className="bg-slate-800/50 rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold capitalize flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  {loopName.replace('-', ' ')}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm font-semibold">
                    {status.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Uptime</p>
                  <p className="text-2xl font-bold text-green-400">{status.uptime}%</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Last Run</p>
                  <p className="text-sm font-semibold">{status.lastRun}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Status</p>
                  <p className="text-sm font-semibold text-green-400">✓ Operational</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                  style={{ width: `${status.uptime}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Growth Analysis */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold mb-4">Growth Projections</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Month 1 Revenue Projection</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-green-400">$3.2M</span>
                    <span className="text-gray-400 text-xs">(Achieved)</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 text-sm mb-2">Month 3 Projection</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-yellow-400">$9.6M</span>
                    <span className="text-gray-400 text-xs">(3x growth)</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 text-sm mb-2">Month 6 Projection</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-orange-400">$32M</span>
                    <span className="text-gray-400 text-xs">(10x growth)</span>
                  </div>
                </div>

                <div>
                  <p className="text-gray-300 text-sm mb-2">Year 1 Projection</p>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-red-400">$144M</span>
                    <span className="text-gray-400 text-xs">(45x growth)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Health */}
            <div className="bg-slate-800/50 rounded-lg p-6 border border-blue-500/20">
              <h3 className="text-xl font-bold mb-4">System Health</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Core Systems Uptime</span>
                  <span className="text-green-400 font-bold">99.8%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Database Performance</span>
                  <span className="text-green-400 font-bold">Optimal</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Response Time</span>
                  <span className="text-green-400 font-bold">&lt;200ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Active Agents</span>
                  <span className="text-green-400 font-bold">54/54</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Processing Queue</span>
                  <span className="text-green-400 font-bold">0 lag</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="bg-slate-800/50 rounded-lg p-6 border border-purple-500/20">
            <h3 className="text-xl font-bold mb-6">Key Performance Indicators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-gray-400 text-xs mb-2">Opportunities/Day</p>
                <p className="text-2xl font-bold">48</p>
                <p className="text-green-400 text-xs mt-1">↑ +15% from week 1</p>
              </div>

              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-gray-400 text-xs mb-2">Win Rate</p>
                <p className="text-2xl font-bold">6.4%</p>
                <p className="text-green-400 text-xs mt-1">↑ Above industry avg</p>
              </div>

              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-gray-400 text-xs mb-2">Avg Contract Value</p>
                <p className="text-2xl font-bold">$712K</p>
                <p className="text-green-400 text-xs mt-1">Government focus</p>
              </div>

              <div className="bg-slate-700/50 rounded p-4">
                <p className="text-gray-400 text-xs mb-2">Response Time</p>
                <p className="text-2xl font-bold">2.2s</p>
                <p className="text-green-400 text-xs mt-1">Proposal generation</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-slate-700/50 text-center text-gray-400 text-sm">
        <p>DreamNet Autonomous Intelligence Dashboard • Vanguard 54 + Wolf Pack Integration</p>
        <p className="mt-2">Real-time metrics from autonomous systems • Last updated: {lastUpdate.toLocaleTimeString()}</p>
      </div>
    </div>
  );
}
