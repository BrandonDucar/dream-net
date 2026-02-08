import { useState } from 'react';
import { ErrorBoundary, DatabaseErrorFallback } from './ErrorBoundary.js';

interface DreamProcessingStage {
  name: string;
  status: 'pending' | 'active' | 'complete';
  description: string;
}

interface ProcessingResult {
  stage: string;
  walletScore: number;
  accessLevel: 'CRADLE' | 'SEED';
  dreamCoreId?: string;
}

export default function DreamProcessor() {
  const [dreamData, setDreamData] = useState('');
  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState<string>('');
  const [stages, setStages] = useState<DreamProcessingStage[]>([
    { name: 'LUCID', status: 'pending', description: 'Initial dream analysis and validation' },
    { name: 'CANVAS', status: 'pending', description: 'Visual interpretation processing' },
    { name: 'ROOT', status: 'pending', description: 'Core meaning extraction' },
    { name: 'ECHO', status: 'pending', description: 'Resonance pattern analysis' },
    { name: 'EVALUATION', status: 'pending', description: 'Wallet score assessment' },
    { name: 'SPAWN', status: 'pending', description: 'Dream core generation' }
  ]);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const processDream = async () => {
    if (!dreamData.trim()) return;
    
    setProcessing(true);
    setLogs(['🌟 Starting dream processing pipeline...']);
    
    try {
      // Stage 1: LUCID Analysis
      await processStage('LUCID', async () => {
        const response = await fetch('/api/dream-processor/lucid', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreamContent: dreamData })
        });
        return await response.json();
      });

      // Stage 2: CANVAS Processing
      await processStage('CANVAS', async () => {
        const response = await fetch('/api/dream-processor/canvas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreamContent: dreamData })
        });
        return await response.json();
      });

      // Stage 3: ROOT Analysis
      await processStage('ROOT', async () => {
        const response = await fetch('/api/dream-processor/root', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreamContent: dreamData })
        });
        return await response.json();
      });

      // Stage 4: ECHO Resonance
      await processStage('ECHO', async () => {
        const response = await fetch('/api/dream-processor/echo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dreamContent: dreamData })
        });
        return await response.json();
      });

      // Stage 5: Wallet Score Evaluation
      const walletScore = await processStage('EVALUATION', async () => {
        const response = await fetch('/api/wallet-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet: '0xDEMO123' }) // Demo wallet
        });
        const data = await response.json();
        return data.score;
      });

      // Determine access level
      const accessLevel = walletScore >= 75 ? 'CRADLE' : 'SEED';
      setLogs(prev => [...prev, `🎯 Wallet score: ${walletScore} → ${accessLevel} access granted`]);

      // Stage 6: Dream Core Spawning
      const dreamCore = await processStage('SPAWN', async () => {
        const response = await fetch('/api/dream-cores/spawn', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            dreamContent: dreamData,
            accessLevel,
            walletScore 
          })
        });
        return await response.json();
      });

      setResult({
        stage: 'COMPLETE',
        walletScore,
        accessLevel,
        dreamCoreId: dreamCore.id
      });

      setLogs(prev => [...prev, `✨ Dream core spawned: ${dreamCore.id}`]);
      setLogs(prev => [...prev, `🏆 Processing complete with ${accessLevel} access`]);

    } catch (error) {
      setLogs(prev => [...prev, `❌ Processing failed: ${(error as Error).message}`]);
    } finally {
      setProcessing(false);
    }
  };

  const processStage = async (stageName: string, processor: () => Promise<any>) => {
    setCurrentStage(stageName);
    setStages(prev => prev.map(stage => 
      stage.name === stageName 
        ? { ...stage, status: 'active' }
        : stage
    ));
    
    setLogs(prev => [...prev, `🔄 Processing ${stageName}...`]);
    
    try {
      const result = await processor();
      
      setStages(prev => prev.map(stage => 
        stage.name === stageName 
          ? { ...stage, status: 'complete' }
          : stage
      ));
      
      setLogs(prev => [...prev, `✅ ${stageName} complete`]);
      return result;
    } catch (error) {
      setLogs(prev => [...prev, `❌ ${stageName} failed: ${(error as Error).message}`]);
      throw error;
    }
  };

  const resetProcessor = () => {
    setDreamData('');
    setCurrentStage('');
    setStages(stages.map(stage => ({ ...stage, status: 'pending' })));
    setResult(null);
    setLogs([]);
  };

  return (
    <ErrorBoundary fallback={DatabaseErrorFallback}>
      <div className="dream-processor">
        <h2>🌌 Dream Processing Pipeline</h2>
        
        <div className="input-section">
          <textarea
            value={dreamData}
            onChange={(e) => setDreamData(e.target.value)}
            placeholder="Enter your dream content here..."
            className="dream-input"
            disabled={processing}
          />
          <div className="controls">
            <button 
              onClick={processDream} 
              disabled={processing || !dreamData.trim()}
              className="process-button"
            >
              {processing ? '🔄 Processing...' : '🚀 Process Dream'}
            </button>
            <button 
              onClick={resetProcessor}
              disabled={processing}
              className="reset-button"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="pipeline-flow">
          <h3>Processing Stages</h3>
          <div className="stages-grid">
            {stages.map((stage, idx) => (
              <div 
                key={stage.name} 
                className={`stage-card ${stage.status} ${currentStage === stage.name ? 'current' : ''}`}
              >
                <div className="stage-name">{stage.name}</div>
                <div className="stage-description">{stage.description}</div>
                <div className="stage-status">
                  {stage.status === 'pending' && '⏳'}
                  {stage.status === 'active' && '🔄'}
                  {stage.status === 'complete' && '✅'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {result && (
          <div className="result-panel">
            <h3>Processing Results</h3>
            <div className="result-grid">
              <div className="result-item">
                <strong>Wallet Score:</strong> {result.walletScore}/100
              </div>
              <div className="result-item">
                <strong>Access Level:</strong> {result.accessLevel}
              </div>
              {result.dreamCoreId && (
                <div className="result-item">
                  <strong>Dream Core ID:</strong> {result.dreamCoreId}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="processing-log">
          <h3>Processing Log</h3>
          <div className="log-container">
            {logs.map((entry, idx) => (
              <div key={idx} className="log-entry">{entry}</div>
            ))}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}