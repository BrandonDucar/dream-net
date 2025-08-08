import React, { useEffect, useRef, useState } from 'react';
import { Dream } from './DreamNodeCard';

type ConstellationProps = {
  dreams: Dream[];
  onDreamSelect?: (dream: Dream) => void;
};

type Node = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  dream: Dream;
  connections: Node[];
};

const emotionColors: Record<string, string> = {
  ambition: '#fbbf24',
  curiosity: '#3b82f6',
  hope: '#10b981',
  joy: '#f59e0b',
  sadness: '#1e40af',
  fear: '#374151',
  chaos: '#dc2626',
  love: '#ec4899',
};

export default function DreamConstellation({ dreams, onDreamSelect }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!dreams.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Initialize nodes with physics properties
    const newNodes: Node[] = dreams.map((dream, index) => {
      const angle = (index / dreams.length) * Math.PI * 2;
      const radius = Math.min(centerX, centerY) * 0.6;
      
      return {
        x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 100,
        y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        dream,
        connections: []
      };
    });

    // Create connections based on emotional similarity
    newNodes.forEach(node => {
      newNodes.forEach(otherNode => {
        if (node !== otherNode) {
          const emotionMatch = node.dream.emotionalProfile.primaryEmotion === otherNode.dream.emotionalProfile.primaryEmotion;
          const healthSimilarity = Math.abs(node.dream.healthScore - otherNode.dream.healthScore) < 20;
          
          if (emotionMatch || healthSimilarity) {
            node.connections.push(otherNode);
          }
        }
      });
    });

    setNodes(newNodes);
  }, [dreams]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update physics
      nodes.forEach(node => {
        // Apply forces
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Gentle pull toward center
        const centerForce = 0.0001;
        node.vx += (centerX - node.x) * centerForce;
        node.vy += (centerY - node.y) * centerForce;

        // Repulsion between nodes
        nodes.forEach(otherNode => {
          if (node !== otherNode) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              const force = (100 - distance) * 0.0005;
              node.vx += (dx / distance) * force;
              node.vy += (dy / distance) * force;
            }
          }
        });

        // Damping
        node.vx *= 0.99;
        node.vy *= 0.99;

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Boundary constraints
        const margin = 30;
        if (node.x < margin) { node.x = margin; node.vx = Math.abs(node.vx); }
        if (node.x > canvas.width - margin) { node.x = canvas.width - margin; node.vx = -Math.abs(node.vx); }
        if (node.y < margin) { node.y = margin; node.vy = Math.abs(node.vy); }
        if (node.y > canvas.height - margin) { node.y = canvas.height - margin; node.vy = -Math.abs(node.vy); }
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.2)';
      ctx.lineWidth = 1;
      nodes.forEach(node => {
        node.connections.forEach(connection => {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connection.x, connection.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const isHovered = hoveredNode === node;
        const radius = isHovered ? 12 : 8;
        const emotion = node.dream.emotionalProfile.primaryEmotion;
        const color = emotionColors[emotion] || '#64748b';
        
        // Outer glow
        if (isHovered) {
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 20);
          gradient.addColorStop(0, color + '80');
          gradient.addColorStop(1, color + '00');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        // Main node
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Health indicator
        const healthRadius = radius + 3;
        const healthAngle = (node.dream.healthScore / 100) * Math.PI * 2;
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, healthRadius, -Math.PI/2, -Math.PI/2 + healthAngle);
        ctx.stroke();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [nodes, hoveredNode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hoveredNode = nodes.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    setHoveredNode(hoveredNode || null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickedNode = nodes.find(node => {
      const dx = mouseX - node.x;
      const dy = mouseY - node.y;
      return Math.sqrt(dx * dx + dy * dy) < 15;
    });

    if (clickedNode && onDreamSelect) {
      onDreamSelect(clickedNode.dream);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      />
      
      {/* Hover tooltip */}
      {hoveredNode && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg pointer-events-none">
          <h4 className="font-bold text-sm">{hoveredNode.dream.remixLineage[0]?.title}</h4>
          <p className="text-xs text-gray-300">Emotion: {hoveredNode.dream.emotionalProfile.primaryEmotion}</p>
          <p className="text-xs text-gray-300">Health: {hoveredNode.dream.healthScore}%</p>
          <p className="text-xs text-gray-300">Engagement: {hoveredNode.dream.engagementScore}%</p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-80 text-white p-3 rounded-lg">
        <h5 className="font-bold text-xs mb-2">Constellation Legend</h5>
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
            <span>Connected by emotion</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border border-green-400 rounded-full"></div>
            <span>Health indicator</span>
          </div>
        </div>
      </div>
    </div>
  );
}