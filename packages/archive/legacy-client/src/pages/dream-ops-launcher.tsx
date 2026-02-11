import DreamOpsLauncher from '@/components/DreamOpsLauncher';

export default function DreamOpsLauncherPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-yellow-300 mb-4">
            DreamOps Agent Launcher
          </h1>
          <p className="text-gray-300 text-lg">
            Complete multi-agent orchestration system with wallet-based access control
          </p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-cyan-500/20 p-8">
          <DreamOpsLauncher />
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Scan a wallet to see available agents and their unlock status</p>
        </div>
      </div>
    </div>
  );
}