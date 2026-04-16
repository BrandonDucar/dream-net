import { useState, useEffect } from 'react';
import { PheromoneScore } from '@dreamnet/shared/types';

export const usePheromone = (wallet: string | null) => {
    const [score, setScore] = useState<PheromoneScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!wallet) return;

        fetch(`/api/pheromone/${wallet}`)
            .then(r => r.json())
            .then(data => {
                setScore(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch pheromone:', err);
                setLoading(false);
            });
    }, [wallet]);

    return { score, loading };
};
