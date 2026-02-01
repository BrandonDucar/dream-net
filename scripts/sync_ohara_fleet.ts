#!/usr/bin/env tsx
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { OharaRegistryService } from '../packages/nerve/src/spine/services/OharaRegistryService.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const REPO_ROOT = path.join(__dirname, '..');
const PACKAGES_DIR = path.join(REPO_ROOT, 'packages');
const FLEET_JSON = path.join(REPO_ROOT, 'packages/client/public/data/fleet.json');
const DEPLOYMENT_JSON = path.join(REPO_ROOT, 'packages/base-mini-apps/contracts/deployment.json');
const MASTER_INVENTORY_PATH = path.join(REPO_ROOT, 'MASTER_INVENTORY.json');

async function main() {
    console.log("🔱 DREAMNET OHARA SYNC INITIALIZING...");

    const registry = OharaRegistryService.getInstance();
    const masterInventory: any = { agents: [], miniApps: [], contracts: {} };

    // 1. Scan Packages (Agents)
    console.log("🔍 Scanning 143 Agent Packages...");
    const packages = fs.readdirSync(PACKAGES_DIR);
    packages.forEach(pkg => {
        const pkgPath = path.join(PACKAGES_DIR, pkg);
        if (fs.statSync(pkgPath).isDirectory()) {
            masterInventory.agents.push({
                id: pkg,
                name: pkg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                package: `@dreamnet/${pkg}`,
                status: 'HEADLESS'
            });
        }
    });

    // 2. Load Fleet (Sovereign Apps)
    if (fs.existsSync(FLEET_JSON)) {
        console.log("🚢 Ingesting Sovereign Fleet...");
        const fleet = JSON.parse(fs.readFileSync(FLEET_JSON, 'utf-8'));
        fleet.forEach((app: any) => {
            const existingAgent = masterInventory.agents.find((a: any) => a.id === app.id);
            if (existingAgent) {
                existingAgent.status = 'ACTIVE';
                existingAgent.description = app.description;
                existingAgent.category = app.category;
            } else {
                masterInventory.miniApps.push({
                    id: app.id,
                    name: app.name,
                    description: app.description,
                    category: app.category,
                    status: 'active'
                });
            }
        });
    }

    // 3. Ingest Contracts
    if (fs.existsSync(DEPLOYMENT_JSON)) {
        console.log("💎 Mapping Distributed Contracts...");
        const deployments = JSON.parse(fs.readFileSync(DEPLOYMENT_JSON, 'utf-8'));
        masterInventory.contracts = deployments;

        // Map contracts back to agents/apps (Simple heuristic)
        Object.entries(deployments.base.contracts).forEach(([name, address]) => {
            const slug = name.toLowerCase().replace(/dream/g, '').replace(/registry/g, '');
            const target = masterInventory.agents.find((a: any) => a.id.includes(slug)) ||
                masterInventory.miniApps.find((a: any) => a.id.includes(slug));

            if (target) {
                target.contractAddress = address;
            }
        });
    }

    // 4. Register with Service
    console.log("🛡️ Registering Swarm with OharaRegistryService...");
    [...masterInventory.agents, ...masterInventory.miniApps].forEach((app: any) => {
        registry.registerApp({
            id: app.id,
            name: app.name,
            description: app.description || "Discovered DreamNet Entity",
            ticker: app.ticker || `$${app.id.slice(0, 4).toUpperCase()}`,
            contractAddress: app.contractAddress,
            category: app.category || 'utility',
            status: app.status === 'HEADLESS' ? 'HEADLESS' : 'ACTIVE'
        });
    });

    // 5. Save Master Inventory
    fs.writeFileSync(MASTER_INVENTORY_PATH, JSON.stringify(masterInventory, null, 2));
    console.log(`✅ SYNC COMPLETE. ${masterInventory.agents.length + masterInventory.miniApps.length} entities indexed.`);
    console.log(`📂 Master Inventory: ${MASTER_INVENTORY_PATH}`);
}

main().catch(console.error);
