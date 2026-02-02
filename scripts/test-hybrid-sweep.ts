import { OptioConnector } from '../packages/organs/digestive/platform-connector/src/optio/OptioConnector';
import fs from 'fs';
import path from 'path';

async function main() {
    console.log('🩺 RUNNING HYBRID SWEEP: SIMPLL vs OPTIO...');

    const connector = new OptioConnector();

    const configPath = path.join(process.cwd(), 'packages/organs/digestive/platform-connector/configs/OptioClusterConfig.json');
    const clusterConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    console.log(`Targeting Cluster: ${clusterConfig.clusterName}`);

    // Logic to differentiate based on ID ranges or metadata
    // For now, we assume Node 1-10 are Optio and 11-20 are Simpll (as per blackboard hint)

    const nodes = clusterConfig.nodes;
    const simpllNodes = nodes.slice(10);
    const optioNodes = nodes.slice(0, 10);

    console.log(`\nPack A (Optio Native): ${optioNodes.length} nodes`);
    console.log(`Pack B (Simpll Hybrid): ${simpllNodes.length} nodes`);

    // Simulate real sweep logic
    console.log('\nScanning Heartbeats...');

    const vigor = await connector.getClusterVigor(nodes.map((n: any) => n.id));

    vigor.forEach((v, i) => {
        const type = i < 10 ? 'OPTIO' : 'SIMPLL';
        console.log(`[${type}] Node ${i + 1}: ${v.status} (Vigor: ${v.vigorScore.toFixed(2)})`);
    });
}

main().catch(console.error);
