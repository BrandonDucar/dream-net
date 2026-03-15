const BRIDGE_URL = process.env.BRIDGE_URL || 'http://localhost:3200';
const AGENT_ID = 'lil-miss-claw-designer';
const HEARTBEAT_INTERVAL = 30000; // 30 seconds

async function registerAgent() {
    try {
        const res = await fetch(`${BRIDGE_URL}/agents/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: AGENT_ID,
                role: 'designer',
                capabilities: ['website-design', 'branding', 'visual-narrative'],
                status: 'ready'
            })
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`✅ Registered ${AGENT_ID} with Agent Spawn Service`);
    } catch (err) {
        console.error('Registration error:', err.message);
    }
}

async function sendHeartbeat() {
    try {
        const res = await fetch(`${BRIDGE_URL}/agents/${AGENT_ID}/heartbeat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                timestamp: new Date().toISOString(),
                memory_usage: process.memoryUsage().heapUsed / 1024 / 1024,
                active_tasks: 0
            })
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`💓 Heartbeat sent`);
    } catch (err) {
        console.error('Heartbeat error:', err.message);
    }
}

async function pollTasks() {
    try {
        const res = await fetch(`${BRIDGE_URL}/agents/${AGENT_ID}/tasks`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        const tasks = data.tasks || [];

        if (tasks.length > 0) {
            console.log(`📋 Received ${tasks.length} tasks`);
            // Process tasks (design website, create branding, etc.)
            for (const task of tasks) {
                await processDesignTask(task);
            }
        }
    } catch (err) {
        console.error('Task poll error:', err.message);
    }
}

async function processDesignTask(task) {
    console.log(`🎨 Processing design task: ${task.id}`);

    // Simulate design work
    const result = {
        task_id: task.id,
        designer_id: AGENT_ID,
        output: {
            website_url: `https://lilmissclaw.replit.dev/design/${task.id}`,
            design_brief: `${task.payload.name} - ${task.payload.description || 'No description provided'}`,
            quality_score: Math.random() * 100,
            completion_time: Date.now()
        }
    };

    // Report completion back to swarm
    try {
        const res = await fetch(`${BRIDGE_URL}/tasks/${task.id}/complete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        console.log(`✅ Completed task: ${task.id}`);
    } catch (err) {
        console.error('Task completion error:', err.message);
    }
}

// Main loop
async function start() {
    console.log(`🌿 Lil Miss Claw Bridge Client Starting...`);

    await registerAgent();

    // Initial poll
    await pollTasks();

    setInterval(async () => {
        await sendHeartbeat();
        await pollTasks();
    }, HEARTBEAT_INTERVAL);
}

start().catch(console.error);
