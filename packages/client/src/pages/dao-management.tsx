import DAOManagement from '../components/DAOManagement.js';
import DreamEmotionEnhancer from '../components/DreamEmotionEnhancer.js';

export default function DAOManagementPage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-2">Dream Network DAOs</h1>
          <p className="text-xl text-zinc-400">
            Decentralized governance for theme-based dream communities
          </p>
        </div>
        
        <DAOManagement />
        
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Dream Enhancement System</h2>
            <p className="text-xl text-zinc-400">
              Emotion-driven capabilities and toolchain access
            </p>
          </div>
          <DreamEmotionEnhancer />
        </div>
      </div>
    </div>
  );
}