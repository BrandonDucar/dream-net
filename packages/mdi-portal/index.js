/**
 * ⚡ index.js
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🧬 MDI Active. Swarm Vitality Online.');

    // Initialize Swarm Registry
    const registryBody = document.getElementById('registry-body');
    if (registryBody) {
        registryBody.innerHTML = '';
        legionData.forEach((agent, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>DN-${1000 + index}</td>
                <td>${agent.name}</td>
                <td style="color: white">${agent.mission}</td>
                <td style="color: var(--neogreen)">${agent.status}</td>
                <td class="legion-tag">${agent.legion}</td>
            `;
            registryBody.appendChild(tr);
        });
    }

    // Initialize Heatmap
    const heatmap = document.getElementById('heatmap');
    for (let i = 0; i < 100; i++) {
        const tile = document.createElement('div');
        tile.className = 'heat-tile';
        if (Math.random() > 0.8) tile.classList.add('safe');
        heatmap.appendChild(tile);
    }

    // Simulated Real-Time Updates (Mirroring scripts/heartbeat-lite.mjs)
    setInterval(() => {
        const time = new Date().toLocaleTimeString();
        const discoveries = [
            { msg: 'Helium scarcity volatility hit 0.42.', critical: true },
            { msg: 'MiroFish expanding node knowledge Graph.', critical: false },
            { msg: 'BigShortClaw confidence threshold met.', critical: true },
            { msg: 'Nanobridge tender node [82] recovered.', critical: false }
        ];

        const roll = Math.floor(Math.random() * discoveries.length);
        const item = discoveries[roll];
        injectDiscovery(time, category, item.msg);

        if (item.critical) {
            triggerHeat();
        }
    }, 5000);

    // Update Swarm Pulse Vibe
    function updateSonicVibe() {
        const vibeVal = document.getElementById('vibe-val');
        const trackName = document.getElementById('track-name');
        
        // Dynamic vibe based on legion intensity
        const baseVibe = 85;
        const jitter = Math.floor(Math.random() * 10);
        if (vibeVal) vibeVal.innerText = `${baseVibe + jitter}%`;

        // Mock tracks list (from SonicPrism context)
        const tracks = [
            "Synchronized Cheddar",
            "MiroFish Deep Sea",
            "Sovereign Resonance",
            "Helium Crisis Core",
            "Digital Twin Echo"
        ];
        
        if (trackName && Math.random() > 0.95) {
            const nextTrack = tracks[Math.floor(Math.random() * tracks.length)];
            trackName.innerText = nextTrack.toUpperCase();
        }
    }

    setInterval(updateSonicVibe, 3000);

    // Audio Sync Toggle
    const audioBtn = document.getElementById('toggle-audio');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            audioBtn.innerText = audioBtn.innerText === 'SYNC_AUDIO' ? 'SYNCED_🟢' : 'SYNC_AUDIO';
        });
    }
    // Sonic Link Handler
    const linkBtn = document.getElementById('sonic-link');
    if (linkBtn) {
        linkBtn.addEventListener('click', () => {
            alert('Sonic Link Active: http://localhost:3003/stream\n\nOpen this URL in VLC or your media player (e.g., Winamp/VLC) to hear the DJ.');
        });
    }

    function triggerHeat() {
        const tiles = document.querySelectorAll('.heat-tile');
        const count = 5;
        for (let i = 0; i < count; i++) {
            const index = Math.floor(Math.random() * tiles.length);
            tiles[index].classList.add('critical');
            setTimeout(() => tiles[index].classList.remove('critical'), 3000);
        }
    }
    function injectDiscovery(time, category, message) {
        const feed = document.getElementById('live-feed');
        const item = document.createElement('div');
        item.className = 'discovery-item';
        item.innerHTML = `
            <span class="timestamp">[${time}]</span>
            <span class="category">${category}</span>
            <span class="message">${message}</span>
        `;
        
        feed.prepend(item);
        if (feed.children.length > 50) feed.removeChild(feed.lastChild);
    }
});
