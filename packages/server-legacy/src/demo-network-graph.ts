#!/usr/bin/env tsx
/**
 * Demo: Network Graph Visualization System
 * 
 * Demonstrates the graph-style mapping of all dreams, cocoons, contributors, and tokens
 * Returns JSON structure for network visualization with nodes and links
 */

import { storage } from "./storage";

async function demonstrateNetworkGraph(): Promise<void> {
  console.log(`
🕸️ Network Graph Visualization Demo
===================================

This demo shows the complete network graph system:
✓ Graph-style mapping of dreams, cocoons, contributors, tokens
✓ JSON output with nodes + links for visualization
✓ Network relationships: created, evolved, contributed, owns, invited
✓ Ready for D3.js, vis.js, or other network visualization libraries
  `);

  try {
    console.log(`\n🎯 STEP 1: Network Graph Structure`);
    console.log(`Output Format:`);
    console.log(`{
  "nodes": [
    {
      "id": "dream-001",
      "type": "dream",
      "label": "AI Art Generator",
      "data": { dream metadata }
    },
    {
      "id": "cocoon-001", 
      "type": "cocoon",
      "label": "AI Art Generator Cocoon",
      "data": { cocoon metadata }
    },
    {
      "id": "contributor-0x742d35...",
      "type": "contributor", 
      "label": "0x742d35...",
      "data": { wallet info }
    },
    {
      "id": "token-001",
      "type": "token",
      "label": "badge token", 
      "data": { token metadata }
    }
  ],
  "links": [
    {
      "source": "dream-001",
      "target": "cocoon-001", 
      "type": "evolved",
      "data": { evolution details }
    },
    {
      "source": "contributor-0x742d35...",
      "target": "cocoon-001",
      "type": "created",
      "data": { creation details }
    }
  ]
}`);

    console.log(`\n🔗 STEP 2: Relationship Types`);
    console.log(`Link Types and Meanings:`);
    console.log(`• CREATED: Contributor created dream/cocoon/token`);
    console.log(`• EVOLVED: Dream evolved into cocoon`);
    console.log(`• CONTRIBUTED: Contributor joined dream/cocoon`);
    console.log(`• OWNS: Contributor owns token`);
    console.log(`• INVITED: Contributor invited another contributor`);

    console.log(`\n🌐 STEP 3: Node Types and Data`);
    console.log(`DREAM NODES:`);
    console.log(`- ID: dream-{dreamId}`);
    console.log(`- Label: Dream title`);
    console.log(`- Data: status, score, wallet, tags, contributors`);

    console.log(`\nCOCOON NODES:`);
    console.log(`- ID: cocoon-{cocoonId}`);
    console.log(`- Label: Cocoon title`);
    console.log(`- Data: stage, score, creator, contributors, dreamId`);

    console.log(`\nCONTRIBUTOR NODES:`);
    console.log(`- ID: contributor-{wallet}`);
    console.log(`- Label: Wallet address (truncated)`);
    console.log(`- Data: full wallet address`);

    console.log(`\nTOKEN NODES:`);
    console.log(`- ID: token-{tokenId}`);
    console.log(`- Label: Token purpose (badge/mint/vote)`);
    console.log(`- Data: purpose, milestone, metadata, mintedAt`);

    console.log(`\n🎮 STEP 4: Simulated Network Generation`);
    console.log(`Processing network data...`);
    
    // Since we don't have real data, simulate the structure
    const mockGraph = {
      nodes: [
        {
          id: "dream-ai-art",
          type: "dream",
          label: "AI Art Generator",
          data: {
            status: "approved",
            score: 85,
            wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e",
            tags: ["ai", "art", "creative"]
          }
        },
        {
          id: "cocoon-ai-art",
          type: "cocoon", 
          label: "AI Art Generator Cocoon",
          data: {
            stage: "complete",
            score: 85,
            creatorWallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
          }
        },
        {
          id: "contributor-0x742d35",
          type: "contributor",
          label: "0x742d35...",
          data: {
            wallet: "0x742d35Cc6527Cc3de8b36b5C81B8a0ea4d5d3a8e"
          }
        },
        {
          id: "contributor-0xd8dA6B",
          type: "contributor", 
          label: "0xd8dA6B...",
          data: {
            wallet: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
          }
        },
        {
          id: "token-badge-001",
          type: "token",
          label: "badge token",
          data: {
            purpose: "badge",
            milestone: "active"
          }
        },
        {
          id: "token-mint-001", 
          type: "token",
          label: "mint token",
          data: {
            purpose: "mint", 
            milestone: "complete"
          }
        }
      ],
      links: [
        {
          source: "dream-ai-art",
          target: "cocoon-ai-art",
          type: "evolved",
          data: { stage: "complete", score: 85 }
        },
        {
          source: "contributor-0x742d35",
          target: "dream-ai-art", 
          type: "created",
          data: { role: "creator" }
        },
        {
          source: "contributor-0x742d35",
          target: "cocoon-ai-art",
          type: "created", 
          data: { role: "creator" }
        },
        {
          source: "contributor-0xd8dA6B",
          target: "cocoon-ai-art",
          type: "contributed",
          data: { role: "Artist" }
        },
        {
          source: "contributor-0x742d35",
          target: "token-badge-001",
          type: "owns",
          data: { purpose: "badge", milestone: "active" }
        },
        {
          source: "contributor-0x742d35", 
          target: "token-mint-001",
          type: "owns",
          data: { purpose: "mint", milestone: "complete" }
        },
        {
          source: "contributor-0x742d35",
          target: "contributor-0xd8dA6B",
          type: "invited",
          data: { role: "Artist", status: "accepted" }
        }
      ]
    };

    console.log(`\n📊 Generated Network Graph:`);
    console.log(`Nodes: ${mockGraph.nodes.length}`);
    console.log(`Links: ${mockGraph.links.length}`);
    
    console.log(`\nNode Distribution:`);
    const nodeTypes = mockGraph.nodes.reduce((acc: any, node) => {
      acc[node.type] = (acc[node.type] || 0) + 1;
      return acc;
    }, {});
    Object.entries(nodeTypes).forEach(([type, count]) => {
      console.log(`• ${type}: ${count}`);
    });

    console.log(`\nLink Distribution:`);
    const linkTypes = mockGraph.links.reduce((acc: any, link) => {
      acc[link.type] = (acc[link.type] || 0) + 1;
      return acc;
    }, {});
    Object.entries(linkTypes).forEach(([type, count]) => {
      console.log(`• ${type}: ${count}`);
    });

    console.log(`\n🎨 STEP 5: Visualization Integration`);
    console.log(`This JSON can be used with:`);
    console.log(`• D3.js force-directed graphs`);
    console.log(`• vis.js network diagrams`); 
    console.log(`• Cytoscape.js network visualization`);
    console.log(`• React Flow diagrams`);
    console.log(`• Any other network visualization library`);

    console.log(`\n📡 STEP 6: API Usage`);
    console.log(`GET /api/network-graph returns the complete network structure`);
    console.log(`Example usage:`);
    console.log(`fetch('/api/network-graph')
  .then(res => res.json())
  .then(graph => {
    // Use with D3.js, vis.js, etc.
    renderNetworkVisualization(graph.nodes, graph.links);
  });`);

    console.log(`\n🔄 STEP 7: Dynamic Updates`);
    console.log(`Network graph reflects real-time data:`);
    console.log(`• New dreams appear as nodes`);
    console.log(`• Dream evolution creates new links`);
    console.log(`• Contributor additions add relationships`);
    console.log(`• Token minting creates ownership links`);
    console.log(`• Invitations show social connections`);

    console.log(`\n✨ Network Graph system is fully implemented!`);
    console.log(`\nKey Features:`);
    console.log(`- Complete ecosystem mapping`);
    console.log(`- Rich relationship data`);
    console.log(`- Visualization-ready JSON format`);
    console.log(`- Real-time data reflection`);
    console.log(`- Multiple visualization library support`);

  } catch (error) {
    console.log(`Demo error: ${error}`);
  }
}

async function main(): Promise<void> {
  await demonstrateNetworkGraph();
  process.exit(0);
}

// Export for modular use
export { demonstrateNetworkGraph };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}