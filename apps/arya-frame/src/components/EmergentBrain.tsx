import React, { useMemo, useRef, useEffect, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

/**
 * EmergentBrain Component
 * Visualizes the Arya Sovereign Intelligence system as a 3D neural network.
 * Maps to the 5 major Brain Regions: Prefrontal, Hippocampus, Motor, Amygdala, Thalamus.
 */

const REGIONS = [
  { id: 'prefrontal', name: 'Prefrontal Cortex', color: '#ff0055', glow: '#ff0055' },
  { id: 'hippocampus', name: 'Hippocampus', color: '#00ccff', glow: '#00ccff' },
  { id: 'motor', name: 'Motor Cortex', color: '#ffcc00', glow: '#ffcc00' },
  { id: 'amygdala', name: 'Amygdala', color: '#ff3300', glow: '#ff3300' },
  { id: 'thalamus', name: 'Thalamus', color: '#66ff00', glow: '#66ff00' }
];

export const EmergentBrain: React.FC<{ velocity?: number }> = ({ velocity = 0.5 }) => {
  const fgRef = useRef<any>();
  const [isWhipping, setIsWhipping] = useState(false);

  useEffect(() => {
    setIsWhipping(velocity > 0.8);
  }, [velocity]);

  // Generate synthetic neural data
  const data = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];

    // Create central hubs for regions
    REGIONS.forEach((region, i) => {
      nodes.push({
        id: region.id,
        name: region.name,
        val: 20,
        color: region.color,
        region: region.id
      });

      // Create satellite neurons for each region
      for (let j = 0; j < 40; j++) {
        const nodeId = `${region.id}_${j}`;
        nodes.push({
          id: nodeId,
          name: `Neuron ${nodeId}`,
          val: Math.random() * 5 + 2,
          color: region.color,
          region: region.id
        });
        links.push({
          source: region.id,
          target: nodeId,
          color: region.color,
          width: 0.5
        });
      }
    });

    // Cross-region synapses (Inter-connectivity)
    for (let i = 0; i < 30; i++) {
      const r1 = REGIONS[Math.floor(Math.random() * REGIONS.length)].id;
      const r2 = REGIONS[Math.floor(Math.random() * REGIONS.length)].id;
      if (r1 !== r2) {
        links.push({
          source: `${r1}_${Math.floor(Math.random() * 20)}`,
          target: `${r2}_${Math.floor(Math.random() * 20)}`,
          color: '#ffffff33',
          width: 0.2
        });
      }
    }

    return { nodes, links };
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      // Configure physics
      fgRef.current.d3Force('charge').strength(-120);
      fgRef.current.d3Force('link').distance(50);
      
      // Bloom/Post-processing (Custom Shader later)
      // For now, use basic emission
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#000' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={data}
        backgroundColor="#000000"
        nodeLabel="name"
        nodeColor={(node: any) => node.color}
        nodeVal={(node: any) => node.val}
        linkColor={(link: any) => link.color}
        linkWidth={(link: any) => link.width}
        linkDirectionalParticles={isWhipping ? 10 : 2}
        linkDirectionalParticleWidth={isWhipping ? 4 : 2}
        linkDirectionalParticleSpeed={isWhipping ? 0.05 : 0.005}
        linkDirectionalParticleColor={() => isWhipping ? '#ff0055' : '#ffffff'}
        onNodeClick={(node: any) => {
          // Focus on region
          const distance = 200;
          const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
          fgRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
            node,
            3000
          );
        }}
        nodeThreeObject={(node: any) => {
          // Add glow to hub nodes
          if (REGIONS.find(r => r.id === node.id)) {
            const mesh = new THREE.Mesh(
              new THREE.SphereGeometry(node.val),
              new THREE.MeshPhongMaterial({ 
                color: node.color,
                emissive: node.color,
                emissiveIntensity: 2,
                transparent: true,
                opacity: 0.9
              })
            );
            return mesh;
          }
          return false; // use default
        }}
      />
      
      {/* Overlay for Stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '20px',
        background: 'rgba(0,0,0,0.7)',
        border: '1px solid #333',
        borderRadius: '8px',
        color: '#fff',
        fontFamily: 'monospace',
        pointerEvents: 'none'
      }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#ff0055' }}>ARYA SOVEREIGN INTELLIGENCE</h2>
        <div style={{ fontSize: '12px' }}>
          <div>SWARM_STATUS: <span style={{ color: '#00ff00' }}>ONLINE</span></div>
          <div>SYNAPSES: <span style={{ color: '#00ccff' }}>17,900</span></div>
          <div>THOUGHT_VELOCITY: <span style={{ color: velocity > 0.8 ? '#ff0055' : '#ffcc00' }}>{(velocity * 100).toFixed(1)} T/S</span></div>
          {velocity > 0.8 && (
            <div style={{ 
              color: '#ff0055', 
              fontWeight: 900, 
              marginTop: '5px',
              animation: 'blink 0.5s infinite' 
            }}>
              ⚠️ SYNAPTIC STORM: MAX VELOCITY ⚠️
            </div>
          )}
          <hr style={{ border: '0.5px solid #333' }} />
          {REGIONS.map(r => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: r.color }}></div>
              <span>{r.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
