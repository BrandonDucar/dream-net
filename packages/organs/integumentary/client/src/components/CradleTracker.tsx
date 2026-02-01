const STAGES = [
  { name: "SEED", emoji: "🌱", description: "The dream is planted." },
  { name: "SPROUT", emoji: "🌿", description: "The dream begins forming roots." },
  { name: "COCOON", emoji: "🪺", description: "The dream is protected and developing." },
  { name: "AWAKENED", emoji: "🦋", description: "The dream has emerged and taken flight." },
  { name: "DREAM CORE", emoji: "🔮", description: "The dream now powers others." }
];

interface CradleTrackerProps {
  evolutionLevel?: number;
}

export default function CradleTracker({ evolutionLevel = 1 }: CradleTrackerProps) {
  return (
    <div className="font-mono bg-black p-5 rounded-xl border-2 border-cyan-400">
      <h3 className="text-lg font-bold text-cyan-400 mb-4">🌀 Dream Evolution Chain</h3>

      <div className="flex flex-col gap-3">
        {STAGES.map((stage, index) => {
          const isActive = evolutionLevel >= index + 1;
          return (
            <div 
              key={stage.name} 
              className={`
                p-3 rounded-lg border-2 transition-all duration-300
                ${isActive 
                  ? 'bg-green-400 text-black border-cyan-400' 
                  : 'bg-gray-800 text-gray-500 border-gray-600 border-dashed'
                }
              `}
            >
              <div className="font-bold">
                {stage.emoji} {stage.name}
              </div>
              <p className="text-sm mt-1 opacity-90">
                {stage.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}