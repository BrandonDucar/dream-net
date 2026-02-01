import React, { useState } from 'react';

type ConstellationFilterProps = {
  filters: { emotion: string; trend: string };
  onChange: (type: string, value: string) => void;
  onConnectionThresholdChange?: (threshold: number) => void;
  onPhysicsToggle?: (enabled: boolean) => void;
  onColorModeChange?: (mode: 'emotion' | 'health' | 'engagement') => void;
  onClusteringToggle?: (enabled: boolean) => void;
};

export default function DreamConstellationFilter({
  filters,
  onChange,
  onConnectionThresholdChange,
  onPhysicsToggle,
  onColorModeChange,
  onClusteringToggle
}: ConstellationFilterProps) {
  const [connectionThreshold, setConnectionThreshold] = useState(50);
  const [physicsEnabled, setPhysicsEnabled] = useState(true);
  const [colorMode, setColorMode] = useState<'emotion' | 'health' | 'engagement'>('emotion');
  const [clusteringEnabled, setClusteringEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConnectionThresholdChange = (value: number) => {
    setConnectionThreshold(value);
    onConnectionThresholdChange?.(value);
  };

  const handlePhysicsToggle = () => {
    const newValue = !physicsEnabled;
    setPhysicsEnabled(newValue);
    onPhysicsToggle?.(newValue);
  };

  const handleColorModeChange = (mode: 'emotion' | 'health' | 'engagement') => {
    setColorMode(mode);
    onColorModeChange?.(mode);
  };

  const handleClusteringToggle = () => {
    const newValue = !clusteringEnabled;
    setClusteringEnabled(newValue);
    onClusteringToggle?.(newValue);
  };

  return (
    <div className="mb-4 bg-gray-800 rounded-lg border border-gray-600">
      {/* Header */}
      <div 
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">🌌 Constellation Controls</span>
          <span className="text-gray-400 text-sm">Configure visualization settings</span>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors">
          {isExpanded ? '▼' : '▶'}
        </button>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="p-4 pt-0 space-y-4">
          {/* Dream Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm font-medium mb-2">Filter by Emotion</label>
              <select
                value={filters.emotion}
                onChange={(e) => onChange('emotion', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Emotions</option>
                <option value="ambition">🔥 Ambition</option>
                <option value="curiosity">🧭 Curiosity</option>
                <option value="hope">🌟 Hope</option>
                <option value="joy">😊 Joy</option>
                <option value="sadness">😢 Sadness</option>
                <option value="fear">😨 Fear</option>
                <option value="chaos">🌪️ Chaos</option>
                <option value="love">❤️ Love</option>
              </select>
            </div>
            <div>
              <label className="block text-white text-sm font-medium mb-2">Filter by Trend</label>
              <select
                value={filters.trend}
                onChange={(e) => onChange('trend', e.target.value)}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">All Trends</option>
                <option value="ascending">📈 Ascending</option>
                <option value="stable">➡️ Stable</option>
                <option value="declining">📉 Declining</option>
                <option value="explosive">💥 Explosive</option>
                <option value="rising">🚀 Rising</option>
              </select>
            </div>
          </div>
          {/* Color Mode Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Node Color Mode</label>
            <div className="flex gap-2">
              {(['emotion', 'health', 'engagement'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleColorModeChange(mode)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    colorMode === mode
                      ? 'bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {mode === 'emotion' ? '🎭 Emotion' : 
                   mode === 'health' ? '🧠 Health' : 
                   '💥 Engagement'}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Threshold */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Connection Threshold: {connectionThreshold}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={connectionThreshold}
              onChange={(e) => handleConnectionThresholdChange(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Few connections</span>
              <span>Many connections</span>
            </div>
          </div>

          {/* Physics Controls */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Physics Simulation</span>
              <p className="text-gray-400 text-xs">Enable node movement and forces</p>
            </div>
            <button
              onClick={handlePhysicsToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                physicsEnabled ? 'bg-cyan-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  physicsEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Clustering Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-white text-sm font-medium">Auto-Clustering</span>
              <p className="text-gray-400 text-xs">Group similar dreams together</p>
            </div>
            <button
              onClick={handleClusteringToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                clusteringEnabled ? 'bg-cyan-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  clusteringEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">Quick Presets</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  handleConnectionThresholdChange(80);
                  handleColorModeChange('emotion');
                  onPhysicsToggle(true);
                }}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
              >
                🎭 Emotional Clusters
              </button>
              <button
                onClick={() => {
                  handleConnectionThresholdChange(20);
                  handleColorModeChange('health');
                  onPhysicsToggle(false);
                }}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
              >
                🧠 Health Analysis
              </button>
              <button
                onClick={() => {
                  handleConnectionThresholdChange(50);
                  handleColorModeChange('engagement');
                  onPhysicsToggle(true);
                }}
                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
              >
                💥 Engagement Flow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}