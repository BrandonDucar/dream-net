import React from 'react';

const getHealthLabel = (score: number) => {
  if (score >= 90) return { label: 'Thriving', color: 'bg-gradient-to-r from-blue-400 to-teal-300' };
  if (score >= 70) return { label: 'Healthy', color: 'bg-green-400' };
  if (score >= 40) return { label: 'Moderate', color: 'bg-yellow-400' };
  return { label: 'Unhealthy', color: 'bg-red-400' };
};

export default function HealthMeter({ score }: { score: number }) {
  const { label, color } = getHealthLabel(score);
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-semibold text-gray-300">Health</span>
        <span className="text-gray-400">{label} ({score}%)</span>
      </div>
      <div className="w-full bg-gray-700 h-2 rounded">
        <div className={`h-full rounded ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}