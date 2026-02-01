import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { audio } from '../systems/AudioEngine';

const WidgetContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff41;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'JetBrains Mono', monospace;
  color: #00ff41;
  cursor: pointer;
  z-index: 9999;
  user-select: none;
  
  &:hover {
    background: rgba(0, 255, 65, 0.1);
  }
`;

const StatusDot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$active ? '#00ff41' : '#ff3333'};
  box-shadow: ${props => props.$active ? '0 0 10px #00ff41' : 'none'};
  transition: all 0.3s ease;
  animation: ${props => props.$active ? 'pulse 2s infinite' : 'none'};

  @keyframes pulse {
    0% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.9); }
    100% { opacity: 1; transform: scale(1); }
  }
`;

const Label = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const Waveform = styled.canvas`
  width: 40px;
  height: 20px;
  opacity: 0.8;
`;

export const MetabolicWidget = () => {
    const [muted, setMuted] = useState(audio.isMuted());
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        const initAudio = async () => {
            // Try to init on mount if allowed, otherwise waiting for click
            await audio.initialize();
        };
        initAudio();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, []);

    useEffect(() => {
        if (muted) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#00ff41';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0, 10);

            // Fake waveform for now (connected to "Thermodynamics" later)
            for (let i = 0; i < canvas.width; i++) {
                ctx.lineTo(i, 10 + Math.sin(i * 0.5 + Date.now() * 0.01) * 5 * Math.random());
            }

            ctx.stroke();
            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
        };
    }, [muted]);

    const toggleAudio = (e: React.MouseEvent) => {
        e.stopPropagation();
        audio.initialize(); // Ensure context is ready
        audio.toggleMute();
        audio.playSFX('click');
        setMuted(audio.isMuted());
    };

    return (
        <WidgetContainer onClick={toggleAudio}>
            <StatusDot $active={!muted} />
            <Label>{muted ? 'OFFLINE' : 'SYS.AUDIO'}</Label>
            <Waveform ref={canvasRef} width={40} height={20} />
        </WidgetContainer>
    );
};
