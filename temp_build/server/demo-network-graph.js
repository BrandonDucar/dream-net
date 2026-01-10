#!/usr/bin/env tsx
"use strict";
/**
 * Demo: Network Graph Visualization System
 *
 * Demonstrates the graph-style mapping of all dreams, cocoons, contributors, and tokens
 * Returns JSON structure for network visualization with nodes and links
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateNetworkGraph = demonstrateNetworkGraph;
function demonstrateNetworkGraph() {
    return __awaiter(this, void 0, void 0, function () {
        var mockGraph, nodeTypes, linkTypes;
        return __generator(this, function (_a) {
            console.log("\n\uD83D\uDD78\uFE0F Network Graph Visualization Demo\n===================================\n\nThis demo shows the complete network graph system:\n\u2713 Graph-style mapping of dreams, cocoons, contributors, tokens\n\u2713 JSON output with nodes + links for visualization\n\u2713 Network relationships: created, evolved, contributed, owns, invited\n\u2713 Ready for D3.js, vis.js, or other network visualization libraries\n  ");
            try {
                console.log("\n\uD83C\uDFAF STEP 1: Network Graph Structure");
                console.log("Output Format:");
                console.log("{\n  \"nodes\": [\n    {\n      \"id\": \"dream-001\",\n      \"type\": \"dream\",\n      \"label\": \"AI Art Generator\",\n      \"data\": { dream metadata }\n    },\n    {\n      \"id\": \"cocoon-001\", \n      \"type\": \"cocoon\",\n      \"label\": \"AI Art Generator Cocoon\",\n      \"data\": { cocoon metadata }\n    },\n    {\n      \"id\": \"contributor-0x742d35...\",\n      \"type\": \"contributor\", \n      \"label\": \"0x742d35...\",\n      \"data\": { wallet info }\n    },\n    {\n      \"id\": \"token-001\",\n      \"type\": \"token\",\n      \"label\": \"badge token\", \n      \"data\": { token metadata }\n    }\n  ],\n  \"links\": [\n    {\n      \"source\": \"dream-001\",\n      \"target\": \"cocoon-001\", \n      \"type\": \"evolved\",\n      \"data\": { evolution details }\n    },\n    {\n      \"source\": \"contributor-0x742d35...\",\n      \"target\": \"cocoon-001\",\n      \"type\": \"created\",\n      \"data\": { creation details }\n    }\n  ]\n}");
                console.log("\n\uD83D\uDD17 STEP 2: Relationship Types");
                console.log("Link Types and Meanings:");
                console.log("\u2022 CREATED: Contributor created dream/cocoon/token");
                console.log("\u2022 EVOLVED: Dream evolved into cocoon");
                console.log("\u2022 CONTRIBUTED: Contributor joined dream/cocoon");
                console.log("\u2022 OWNS: Contributor owns token");
                console.log("\u2022 INVITED: Contributor invited another contributor");
                console.log("\n\uD83C\uDF10 STEP 3: Node Types and Data");
                console.log("DREAM NODES:");
                console.log("- ID: dream-{dreamId}");
                console.log("- Label: Dream title");
                console.log("- Data: status, score, wallet, tags, contributors");
                console.log("\nCOCOON NODES:");
                console.log("- ID: cocoon-{cocoonId}");
                console.log("- Label: Cocoon title");
                console.log("- Data: stage, score, creator, contributors, dreamId");
                console.log("\nCONTRIBUTOR NODES:");
                console.log("- ID: contributor-{wallet}");
                console.log("- Label: Wallet address (truncated)");
                console.log("- Data: full wallet address");
                console.log("\nTOKEN NODES:");
                console.log("- ID: token-{tokenId}");
                console.log("- Label: Token purpose (badge/mint/vote)");
                console.log("- Data: purpose, milestone, metadata, mintedAt");
                console.log("\n\uD83C\uDFAE STEP 4: Simulated Network Generation");
                console.log("Processing network data...");
                mockGraph = {
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
                console.log("\n\uD83D\uDCCA Generated Network Graph:");
                console.log("Nodes: ".concat(mockGraph.nodes.length));
                console.log("Links: ".concat(mockGraph.links.length));
                console.log("\nNode Distribution:");
                nodeTypes = mockGraph.nodes.reduce(function (acc, node) {
                    acc[node.type] = (acc[node.type] || 0) + 1;
                    return acc;
                }, {});
                Object.entries(nodeTypes).forEach(function (_a) {
                    var type = _a[0], count = _a[1];
                    console.log("\u2022 ".concat(type, ": ").concat(count));
                });
                console.log("\nLink Distribution:");
                linkTypes = mockGraph.links.reduce(function (acc, link) {
                    acc[link.type] = (acc[link.type] || 0) + 1;
                    return acc;
                }, {});
                Object.entries(linkTypes).forEach(function (_a) {
                    var type = _a[0], count = _a[1];
                    console.log("\u2022 ".concat(type, ": ").concat(count));
                });
                console.log("\n\uD83C\uDFA8 STEP 5: Visualization Integration");
                console.log("This JSON can be used with:");
                console.log("\u2022 D3.js force-directed graphs");
                console.log("\u2022 vis.js network diagrams");
                console.log("\u2022 Cytoscape.js network visualization");
                console.log("\u2022 React Flow diagrams");
                console.log("\u2022 Any other network visualization library");
                console.log("\n\uD83D\uDCE1 STEP 6: API Usage");
                console.log("GET /api/network-graph returns the complete network structure");
                console.log("Example usage:");
                console.log("fetch('/api/network-graph')\n  .then(res => res.json())\n  .then(graph => {\n    // Use with D3.js, vis.js, etc.\n    renderNetworkVisualization(graph.nodes, graph.links);\n  });");
                console.log("\n\uD83D\uDD04 STEP 7: Dynamic Updates");
                console.log("Network graph reflects real-time data:");
                console.log("\u2022 New dreams appear as nodes");
                console.log("\u2022 Dream evolution creates new links");
                console.log("\u2022 Contributor additions add relationships");
                console.log("\u2022 Token minting creates ownership links");
                console.log("\u2022 Invitations show social connections");
                console.log("\n\u2728 Network Graph system is fully implemented!");
                console.log("\nKey Features:");
                console.log("- Complete ecosystem mapping");
                console.log("- Rich relationship data");
                console.log("- Visualization-ready JSON format");
                console.log("- Real-time data reflection");
                console.log("- Multiple visualization library support");
            }
            catch (error) {
                console.log("Demo error: ".concat(error));
            }
            return [2 /*return*/];
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, demonstrateNetworkGraph()];
                case 1:
                    _a.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
// Run if called directly
if (import.meta.url === "file://".concat(process.argv[1])) {
    main().catch(console.error);
}
