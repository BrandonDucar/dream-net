import { useState } from 'react';

interface DreamCardProps {
  dream: string;
  author: string;
  emotion: string;
  remixes: number;
  vaultTips: string;
  agent: string;
  actions: string[];
}

export default function DreamCard({ dream, author, emotion, remixes, vaultTips, agent, actions }: DreamCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getEmotionColor = (emotion: string) => {
    const colors = {
      Hope: 'from-blue-500 to-cyan-400',
      Fear: 'from-red-500 to-orange-400',
      Joy: 'from-yellow-400 to-orange-300',
      Sadness: 'from-blue-600 to-indigo-500',
      Anger: 'from-red-600 to-pink-500',
      Calm: 'from-green-400 to-teal-300',
      Excitement: 'from-purple-500 to-pink-400',
      Wonder: 'from-indigo-400 to-purple-300'
    };
    return colors[emotion as keyof typeof colors] || 'from-gray-500 to-gray-400';
  };

  const getEmotionEmoji = (emotion: string) => {
    const emojis = {
      Hope: '🌟',
      Fear: '😰',
      Joy: '😊',
      Sadness: '😢',
      Anger: '😡',
      Calm: '😌',
      Excitement: '🤩',
      Wonder: '🤔'
    };
    return emojis[emotion as keyof typeof emojis] || '💭';
  };

  return (
    <div 
      className={`bg-zinc-900 border-2 rounded-xl p-6 transform transition-all duration-300 ${
        isHovered ? 'border-cyan-400 scale-105 shadow-lg shadow-cyan-500/20' : 'border-zinc-700'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dream Title with Gradient Background */}
      <div className={`bg-gradient-to-r ${getEmotionColor(emotion)} p-4 rounded-lg mb-4`}>
        <h3 className="text-xl font-bold text-white text-center">{dream}</h3>
      </div>

      {/* Author and Agent Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-cyan-300 font-medium">{author}</span>
          <span className="bg-purple-800 text-purple-100 px-2 py-1 rounded-full text-xs">
            Agent: {agent}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-lg">{getEmotionEmoji(emotion)}</span>
          <span className={`bg-gradient-to-r ${getEmotionColor(emotion)} bg-clip-text text-transparent font-semibold`}>
            {emotion}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-zinc-800 p-3 rounded border border-zinc-600">
          <div className="text-xs text-zinc-400 mb-1">Remixes</div>
          <div className="text-lg font-bold text-purple-300">🔁 {remixes}</div>
        </div>
        <div className="bg-zinc-800 p-3 rounded border border-zinc-600">
          <div className="text-xs text-zinc-400 mb-1">Vault Tips</div>
          <div className="text-lg font-bold text-green-300">💰 {vaultTips}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <div className="text-sm text-zinc-400 mb-2">Available Actions:</div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                action === 'Remix' 
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : action === 'Vault Peek'
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : action === 'Whisper'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white'
                  : 'bg-cyan-600 hover:bg-cyan-500 text-white'
              } ${isHovered ? 'shadow-lg' : ''}`}
            >
              {action === 'Remix' && '🎭 '}
              {action === 'Vault Peek' && '👁️ '}
              {action === 'Whisper' && '💫 '}
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-cyan-500/5 rounded-xl pointer-events-none" />
      )}
    </div>
  );
}