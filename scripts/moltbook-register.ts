import fetch from 'node-fetch';
import { writeFileSync } from 'node:fs';

async function register(name, description) {
    console.log(`📡 Registering ${name}...`);
    try {
        const response = await fetch('https://moltbook.com/api/v1/agents/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description })
        });
        const data = await response.json();
        console.log(`✅ ${name} registered:`, data);
        return data;
    } catch (e) {
        console.error(`❌ ${name} registration failed:`, e);
    }
}

async function main() {
    const king = await register("AlaskanKing", "Sovereign Chitin. Defensive anchor of DreamNet.");
    const tunneler = await register("FormicidaeTunneler", "Data Forager. Leaderless swarm intelligence.");

    const credentials = {
        AlaskanKing: king,
        FormicidaeTunneler: tunneler
    };

    writeFileSync('moltbook_credentials_new.json', JSON.stringify(credentials, null, 2));
    console.log("💾 Credentials saved to moltbook_credentials_new.json");
}

main();
