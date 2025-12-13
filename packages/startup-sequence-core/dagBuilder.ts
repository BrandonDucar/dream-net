/**
 * Dependency DAG Builder
 * 
 * Builds and validates dependency DAG
 * Topological sorting for initialization order
 */

import type { DependencyDAG, ServiceNode, DependencyEdge } from './types';

export class DAGBuilder {
  /**
   * Build DAG from service nodes
   */
  buildDAG(nodes: ServiceNode[]): DependencyDAG {
    const edges: DependencyEdge[] = [];
    
    // Build edges from node dependencies
    for (const node of nodes) {
      for (const depId of node.dependencies) {
        edges.push({
          from: depId,
          to: node.id,
          type: 'required',
        });
      }
    }
    
    return { nodes, edges };
  }
  
  /**
   * Validate DAG (check for cycles)
   */
  validateDAG(dag: DependencyDAG): { valid: boolean; cycles?: string[][] } {
    const visited = new Set<string>();
    const recStack = new Set<string>();
    const cycles: string[][] = [];
    
    const dfs = (nodeId: string, path: string[]): void => {
      if (recStack.has(nodeId)) {
        // Cycle detected
        const cycleStart = path.indexOf(nodeId);
        cycles.push(path.slice(cycleStart));
        return;
      }
      
      if (visited.has(nodeId)) {
        return;
      }
      
      visited.add(nodeId);
      recStack.add(nodeId);
      
      // Find edges from this node
      const outgoingEdges = dag.edges.filter(e => e.from === nodeId);
      
      for (const edge of outgoingEdges) {
        dfs(edge.to, [...path, nodeId]);
      }
      
      recStack.delete(nodeId);
    };
    
    // Check all nodes
    for (const node of dag.nodes) {
      if (!visited.has(node.id)) {
        dfs(node.id, []);
      }
    }
    
    return {
      valid: cycles.length === 0,
      cycles: cycles.length > 0 ? cycles : undefined,
    };
  }
  
  /**
   * Topological sort (Kahn's algorithm)
   * Returns initialization order
   */
  topologicalSort(dag: DependencyDAG): string[] {
    const inDegree = new Map<string, number>();
    const graph = new Map<string, string[]>();
    
    // Initialize in-degree
    for (const node of dag.nodes) {
      inDegree.set(node.id, 0);
      graph.set(node.id, []);
    }
    
    // Build graph and calculate in-degrees
    for (const edge of dag.edges) {
      if (edge.type === 'required') {
        const current = inDegree.get(edge.to) ?? 0;
        inDegree.set(edge.to, current + 1);
        
        const neighbors = graph.get(edge.from) ?? [];
        neighbors.push(edge.to);
        graph.set(edge.from, neighbors);
      }
    }
    
    // Find nodes with no dependencies
    const queue: string[] = [];
    for (const [nodeId, degree] of inDegree.entries()) {
      if (degree === 0) {
        queue.push(nodeId);
      }
    }
    
    const result: string[] = [];
    
    // Process queue
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      result.push(nodeId);
      
      const neighbors = graph.get(nodeId) ?? [];
      for (const neighbor of neighbors) {
        const degree = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, degree);
        
        if (degree === 0) {
          queue.push(neighbor);
        }
      }
    }
    
    // Check if all nodes processed (no cycles)
    if (result.length !== dag.nodes.length) {
      throw new Error('DAG contains cycles or disconnected nodes');
    }
    
    return result;
  }
}

export const dagBuilder = new DAGBuilder();

