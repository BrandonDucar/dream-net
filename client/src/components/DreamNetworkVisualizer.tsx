import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface DreamNetworkVisualizerProps {
  className?: string;
}

interface DreamNode {
  id: string;
  name: string;
  cloud: string;
  x: number;
  y: number;
  level: number;
  connections: string[];
  status: 'active' | 'nightmare' | 'evolved' | 'dormant';
}

const cloudColors = {
  meme: '#ef4444',
  zk: '#8b5cf6', 
  defi: '#06b6d4',
  nightmare: '#7c2d12',
  gaming: '#10b981',
  ai: '#f59e0b',
  desci: '#ec4899'
};

export default function DreamNetworkVisualizer({ className = "" }: DreamNetworkVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeFilters, setActiveFilters] = useState({
    meme: true,
    zk: true,
    defi: true,
    nightmare: true,
    gaming: true,
    ai: true,
    desci: true
  });
  const [connectionStrength, setConnectionStrength] = useState(100);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const { data: networkData = [] } = useQuery({
    queryKey: ['/api/dream-network/visualization'],
    queryFn: async (): Promise<DreamNode[]> => {
      try {
        const response = await fetch('/api/dream-network/visualization');
        if (!response.ok) throw new Error('Network error');
        return response.json();
      } catch (error) {
        // Fallback to static visualization data
        return generateMockNetworkData();
      }
    },
    refetchInterval: 30000
  });

  const generateMockNetworkData = (): DreamNode[] => {
    const clouds = ['meme', 'zk', 'defi', 'nightmare', 'gaming', 'ai', 'desci'];
    const nodes: DreamNode[] = [];
    
    clouds.forEach((cloud, cloudIndex) => {
      const cloudNodes = 8 + Math.floor(Math.random() * 12);
      const centerX = 150 + (cloudIndex % 3) * 250;
      const centerY = 150 + Math.floor(cloudIndex / 3) * 200;
      
      for (let i = 0; i < cloudNodes; i++) {
        const angle = (i / cloudNodes) * 2 * Math.PI;
        const radius = 60 + Math.random() * 40;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        const status = Math.random() < 0.1 ? 'nightmare' : 
                     Math.random() < 0.15 ? 'evolved' :
                     Math.random() < 0.05 ? 'dormant' : 'active';
        
        nodes.push({
          id: `${cloud}-${i}`,
          name: `${cloud.charAt(0).toUpperCase() + cloud.slice(1)} Dream ${i}`,
          cloud,
          x,
          y,
          level: Math.floor(Math.random() * 5) + 1,
          connections: [],
          status
        });
      }
    });

    // Generate connections
    nodes.forEach(node => {
      const connectionCount = Math.floor(Math.random() * 4) + 1;
      const potentialConnections = nodes.filter(n => 
        n.id !== node.id && 
        Math.random() < 0.3 &&
        node.connections.length < 4
      );
      
      for (let i = 0; i < Math.min(connectionCount, potentialConnections.length); i++) {
        const target = potentialConnections[i];
        if (!node.connections.includes(target.id)) {
          node.connections.push(target.id);
        }
      }
    });

    return nodes;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !networkData.length) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Filter nodes based on active filters
      const visibleNodes = networkData.filter(node => activeFilters[node.cloud as keyof typeof activeFilters]);
      
      // Draw connections first
      ctx.strokeStyle = `rgba(255, 255, 255, ${connectionStrength / 200})`;
      ctx.lineWidth = 1;
      
      visibleNodes.forEach(node => {
        node.connections.forEach(connectionId => {
          const target = visibleNodes.find(n => n.id === connectionId);
          if (target) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(target.x, target.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      visibleNodes.forEach(node => {
        const color = cloudColors[node.cloud as keyof typeof cloudColors] || '#666666';
        const size = 4 + node.level * 2;
        
        // Node glow effect
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'transparent');
        
        // Status-based styling
        if (node.status === 'nightmare') {
          ctx.fillStyle = '#7c2d12';
          ctx.shadowColor = '#dc2626';
          ctx.shadowBlur = 8;
        } else if (node.status === 'evolved') {
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
        } else if (node.status === 'dormant') {
          ctx.fillStyle = '#374151';
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Highlight hovered node
        if (hoveredNode === node.id) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        
        ctx.shadowBlur = 0;
      });
    };

    // Handle mouse interactions
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const visibleNodes = networkData.filter(node => activeFilters[node.cloud as keyof typeof activeFilters]);
      const hoveredNode = visibleNodes.find(node => {
        const distance = Math.sqrt((mouseX - node.x) ** 2 + (mouseY - node.y) ** 2);
        return distance < (4 + node.level * 2) + 5;
      });
      
      setHoveredNode(hoveredNode?.id || null);
      canvas.style.cursor = hoveredNode ? 'pointer' : 'default';
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    
    render();
    
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [networkData, activeFilters, connectionStrength, hoveredNode]);

  const handleFilterToggle = (cloud: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [cloud]: !prev[cloud as keyof typeof activeFilters]
    }));
  };

  const getFilterCount = () => {
    return Object.values(activeFilters).filter(Boolean).length;
  };

  const visibleNodeCount = networkData.filter(node => 
    activeFilters[node.cloud as keyof typeof activeFilters]
  ).length;

  return (
    <div id="dream-visualizer" className={`dream-network-visualizer bg-black/90 border border-cyan-500 rounded-lg p-4 ${className}`}>
      <style>{`
        .dream-network-visualizer {
          box-shadow: 0 0 25px rgba(6, 182, 212, 0.3);
        }
        .filter-chip {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .filter-chip.active {
          transform: scale(1.05);
        }
        .visualization-canvas {
          border: 1px solid #374151;
          border-radius: 8px;
          background: radial-gradient(circle at center, #0f1419 0%, #000000 100%);
        }
        .connection-slider {
          background: linear-gradient(90deg, #374151, #06b6d4);
        }
      `}</style>
      
      <div className="mb-4">
        <h3 className="text-xl font-bold text-cyan-400 mb-2">🌐 Dream Network Visualization</h3>
        <div className="text-sm text-gray-400">
          {visibleNodeCount} dreams across {getFilterCount()} clouds
        </div>
      </div>

      <div className="mb-4">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="visualization-canvas w-full h-96"
        />
      </div>

      <div id="filters" className="mb-4">
        <h4 className="text-cyan-300 font-semibold mb-2">Cloud Filters</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(cloudColors).map(([cloud, color]) => (
            <label key={cloud} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={activeFilters[cloud as keyof typeof activeFilters]}
                onChange={() => handleFilterToggle(cloud)}
                className="hidden"
              />
              <div
                className={`filter-chip px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                  activeFilters[cloud as keyof typeof activeFilters]
                    ? 'active text-white'
                    : 'text-gray-400 border-gray-600'
                }`}
                style={{
                  borderColor: activeFilters[cloud as keyof typeof activeFilters] ? color : '#4b5563',
                  backgroundColor: activeFilters[cloud as keyof typeof activeFilters] ? `${color}30` : 'transparent'
                }}
              >
                {cloud.charAt(0).toUpperCase() + cloud.slice(1)}
              </div>
            </label>
          ))}
        </div>
      </div>

      <div id="slider" className="mb-4">
        <h4 className="text-cyan-300 font-semibold mb-2">Connection Visibility</h4>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Hidden</span>
          <input
            type="range"
            min="0"
            max="100"
            value={connectionStrength}
            onChange={(e) => setConnectionStrength(Number(e.target.value))}
            className="connection-slider flex-1 h-2 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-400">Visible</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Connection opacity: {connectionStrength}%
        </div>
      </div>

      {hoveredNode && (
        <div className="p-3 bg-black/80 border border-cyan-600 rounded-lg">
          <div className="text-cyan-300 font-semibold">
            {networkData.find(n => n.id === hoveredNode)?.name}
          </div>
          <div className="text-sm text-gray-400">
            Cloud: {networkData.find(n => n.id === hoveredNode)?.cloud} • 
            Level: {networkData.find(n => n.id === hoveredNode)?.level} • 
            Status: {networkData.find(n => n.id === hoveredNode)?.status}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 mt-4">
        <div>• Hover over nodes for details</div>
        <div>• Larger nodes indicate higher levels</div>
        <div>• Red nodes are nightmares, glowing nodes are evolved</div>
      </div>
    </div>
  );
}