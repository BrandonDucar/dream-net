import React from 'react';

type FilterProps = {
  onFilterChange: (type: string, value: string) => void;
  onSortChange: (sortKey: string) => void;
};

export default function DreamFilterBar({ onFilterChange, onSortChange }: FilterProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center mb-6">
      {/* Emotion Filter */}
      <select
        onChange={(e) => onFilterChange('emotion', e.target.value)}
        className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="">All Emotions</option>
        <option value="ambition">Ambition</option>
        <option value="curiosity">Curiosity</option>
        <option value="hope">Hope</option>
        <option value="joy">Joy</option>
        <option value="sadness">Sadness</option>
        <option value="fear">Fear</option>
        <option value="chaos">Chaos</option>
        <option value="love">Love</option>
      </select>

      {/* Trend Filter */}
      <select
        onChange={(e) => onFilterChange('trend', e.target.value)}
        className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="">All Trends</option>
        <option value="ascending">Ascending</option>
        <option value="stable">Stable</option>
        <option value="declining">Declining</option>
        <option value="explosive">Explosive</option>
        <option value="rising">Rising</option>
      </select>

      {/* Sorter */}
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="px-3 py-1 rounded bg-gray-800 text-white border border-gray-600"
      >
        <option value="none">Sort By</option>
        <option value="health">Health Score</option>
        <option value="engagement">Engagement Score</option>
        <option value="remixes">Remix Count</option>
        <option value="likes">Likes</option>
        <option value="intensity">Intensity</option>
      </select>

      {/* Health Range Filter */}
      <div className="flex items-center gap-2">
        <label className="text-white text-sm">Health:</label>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="0"
          onChange={(e) => onFilterChange('healthMin', e.target.value)}
          className="w-20"
        />
        <span className="text-white text-xs">0-100</span>
      </div>
    </div>
  );
}