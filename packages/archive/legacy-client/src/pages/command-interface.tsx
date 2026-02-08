import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface CommandExecution {
  success: boolean;
  execution: {
    success: boolean;
    command: string;
    result?: any;
    error?: string;
    timestamp: string;
  };
  commandLine: string;
  executedBy: string;
}

interface CommandHistory {
  id: string;
  command: string;
  result: CommandExecution;
  timestamp: number;
}

export default function CommandInterface() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  
  const queryClient = useQueryClient();

  // Fetch available commands
  const { data: commandsData } = useQuery<{
    success: boolean;
    commands: Record<string, {
      description: string;
      format: string;
      example: string;
      requiresAuth: boolean;
    }>;
    operatorAccess: boolean;
    wallet: string;
  }>({
    queryKey: ['/api/ecosystem/commands'],
  });

  // Execute command mutation
  const executeCommand = useMutation({
    mutationFn: async (commandLine: string): Promise<CommandExecution> => {
      const response = await apiRequest('/api/ecosystem/command', {
        method: 'POST',
        body: JSON.stringify({ commandLine }),
        headers: { 'Content-Type': 'application/json' }
      });
      return response as unknown as CommandExecution;
    },
    onSuccess: (result, commandLine) => {
      const newEntry: CommandHistory = {
        id: `cmd-${Date.now()}`,
        command: commandLine,
        result,
        timestamp: Date.now()
      };
      setHistory(prev => [...prev, newEntry]);
      setCommand('');
      setHistoryIndex(-1);
      queryClient.invalidateQueries({ queryKey: ['/api/ecosystem'] });
    }
  });

  // Handle command submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand.mutate(command.trim());
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(history[newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCommand(history[newIndex].command);
        }
      }
    }
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  // Auto-focus input
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cyan-400 mb-2">Dream Network Command Interface</h1>
        <p className="text-gray-400">
          Execute ecosystem commands • {commandsData?.operatorAccess ? 'Operator Access' : 'User Access'}
        </p>
      </div>

      {/* Available Commands */}
      {commandsData && (
        <div className="mb-6 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-white mb-3">Available Commands</h2>
          <div className="space-y-2">
            {Object.entries(commandsData.commands).map(([cmd, info]) => (
              <div key={cmd} className="text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-cyan-400 font-mono">{cmd}</span>
                  {info.requiresAuth && (
                    <span className="bg-yellow-600 text-yellow-100 px-2 py-0.5 rounded text-xs">
                      AUTH
                    </span>
                  )}
                </div>
                <div className="text-gray-400 ml-4">{info.description}</div>
                <div className="text-gray-500 ml-4 font-mono text-xs">
                  Example: {info.example}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div 
        ref={outputRef}
        className="bg-black border border-gray-700 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm mb-4"
      >
        {history.length === 0 ? (
          <div className="text-gray-500">
            Dream Network Command Interface v1.0<br/>
            Type commands to interact with the ecosystem.<br/>
            Use arrow keys to navigate command history.<br/>
            <br/>
            Ready for input...
          </div>
        ) : (
          history.map((entry) => (
            <div key={entry.id} className="mb-4">
              {/* Command */}
              <div className="text-cyan-400">
                <span className="text-gray-500">[{formatTimestamp(entry.timestamp)}]</span>
                <span className="ml-2">$</span> {entry.command}
              </div>
              
              {/* Result */}
              <div className="ml-4 mt-1">
                {entry.result.execution.success ? (
                  <div className="text-green-400">
                    <div>✓ {entry.result.execution.command} executed successfully</div>
                    {entry.result.execution.result && (
                      <div className="mt-1 text-green-300">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(entry.result.execution.result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-red-400">
                    ✗ Error: {entry.result.execution.error}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {/* Loading indicator */}
        {executeCommand.isPending && (
          <div className="text-yellow-400">
            <span className="text-gray-500">[{formatTimestamp(Date.now())}]</span>
            <span className="ml-2">$</span> {command}
            <div className="ml-4 mt-1">Executing...</div>
          </div>
        )}
      </div>

      {/* Command Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400 font-mono">
            $
          </span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter command..."
            className="w-full pl-8 pr-4 py-2 bg-gray-900 border border-gray-700 rounded text-white font-mono focus:border-cyan-400 focus:outline-none"
            disabled={executeCommand.isPending}
          />
        </div>
        <button
          type="submit"
          disabled={!command.trim() || executeCommand.isPending}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 text-white rounded transition-colors"
        >
          Execute
        </button>
      </form>

      {/* Quick Commands */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCommand('remix infected:7b3d')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-mono"
        >
          remix infected:7b3d
        </button>
        <button
          onClick={() => setCommand('unlock agent:wing wallet:0xABC')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-mono"
        >
          unlock agent:wing wallet:0xABC
        </button>
        <button
          onClick={() => setCommand('inject sheep:5000 wallet:0xDEF')}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-mono"
        >
          inject sheep:5000 wallet:0xDEF
        </button>
      </div>
    </div>
  );
}