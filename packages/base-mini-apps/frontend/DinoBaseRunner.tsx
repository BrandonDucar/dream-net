import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useGameRegistry, GameType } from './hooks/useGameRegistry.js';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

export function DinoBaseRunner() {
    const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameover'>('menu');
    const [score, setScore] = useState(0);
    const [dinoY, setDinoY] = useState(0);
    const [isJumping, setIsJumping] = useState(false);
    const [obstacles, setObstacles] = useState<Array<{ id: number; x: number }>>([]);
    const gameRef = useRef<HTMLDivElement>(null);
    const { address } = useAccount();
    const { submitScore, getBestScore } = useGameRegistry();

    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;
    const GROUND_Y = 0;
    const velocRef = useRef(0);

    const jump = useCallback(() => {
        if (!isJumping && gameState === 'playing') {
            velocRef.current = JUMP_FORCE;
            setIsJumping(true);
        }
    }, [isJumping, gameState]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'ArrowUp') {
                e.preventDefault();
                jump();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameState, jump]);

    useEffect(() => {
        if (gameState !== 'playing') return;

        const loop = setInterval(() => {
            // Dino physics
            setDinoY(prevY => {
                let newVel = velocRef.current + GRAVITY;
                velocRef.current = newVel;
                let newY = prevY + newVel;

                if (newY >= GROUND_Y) {
                    newY = GROUND_Y;
                    setIsJumping(false);
                    velocRef.current = 0;
                }
                return newY;
            });

            // Move obstacles
            setObstacles(prev => {
                const next = prev.map(o => ({ ...o, x: o.x - 5 }))
                    .filter(o => o.x > -50);

                // Collision check
                const hit = next.some(o => o.x < 60 && o.x > 20 && dinoY > -30);
                if (hit) {
                    setGameState('gameover');
                    return prev;
                }
                return next;
            });

            setScore(s => s + 1);
        }, 16);

        const spawner = setInterval(() => {
            setObstacles(prev => [...prev, { id: Date.now(), x: 600 }]);
        }, 2000);

        return () => {
            clearInterval(loop);
            clearInterval(spawner);
        };
    }, [gameState, dinoY]);

    const startGame = () => {
        setGameState('playing');
        setScore(0);
        setDinoY(0);
        setObstacles([]);
        velocRef.current = 0;
    };

    return (
        <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-4 text-electric-cyan">🦖 Dino Base Runner</h1>
            <p className="text-gray-400 mb-8">Jump to survive. progress is solid.</p>

            <div
                ref={gameRef}
                className="relative w-full max-w-2xl h-64 bg-zinc-900 border-b-4 border-electric-cyan overflow-hidden"
                onClick={jump}
            >
                <div
                    className="absolute left-10 text-4xl"
                    style={{ bottom: -dinoY }}
                >🦖</div>

                {obstacles.map(o => (
                    <div
                        key={o.id}
                        className="absolute text-3xl"
                        style={{ bottom: 0, left: o.x }}
                    >🌵</div>
                ))}

                {gameState === 'menu' && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
                        <Button onClick={startGame} size="lg">Start Game</Button>
                    </div>
                )}

                {gameState === 'gameover' && (
                    <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center">
                        <h2 className="text-2xl font-bold mb-2">EXTINCT</h2>
                        <p className="mb-4">Score: {score}</p>
                        <Button onClick={startGame}>Re-Evolve</Button>
                    </div>
                )}
            </div>

            <div className="mt-8 text-2xl font-mono">Score: {score}</div>
        </div>
    );
}
