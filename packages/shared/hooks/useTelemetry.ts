import { useState, useEffect } from 'react';
import { AntigravityAPI } from '../utils/api';

export function useTelemetry(wallet?: string) {
    const [scent, setScent] = useState<any>(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [swarm, setSwarm] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nodesData, swarmData, tasksData] = await Promise.all([
                    AntigravityAPI.getNodesStatus(),
                    AntigravityAPI.getSwarmStatus(),
                    AntigravityAPI.getTaskQueue()
                ]);

                setNodes(nodesData);
                setSwarm(swarmData);
                setTasks(tasksData);

                if (wallet) {
                    const scentData = await AntigravityAPI.getPheromoneScore(wallet);
                    setScent(scentData);
                }
            } catch (error) {
                console.error('Failed to fetch telemetry:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 10000); // 10s heartbeats

        return () => clearInterval(interval);
    }, [wallet]);

    return { scent, nodes, swarm, tasks, loading };
}
