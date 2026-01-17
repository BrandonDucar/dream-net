import { Howl } from 'howler';

// DreamNet Audio Engine (Sector 7: Data Sonification)
// "The Heartbeat of the Machine"

type SoundType = 'hover' | 'click' | 'success' | 'error' | 'power_on' | 'glitch';

class AudioEngine {
    private static instance: AudioEngine;
    private ambientHum: Howl | null = null;
    private sounds: Map<SoundType, Howl> = new Map();
    private muted: boolean = false;
    private audioContext: AudioContext | null = null;

    private constructor() {
        this.muted = localStorage.getItem('dreamnet_audio_muted') === 'true';
    }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public async initialize() {
        if (this.audioContext) return;

        // Initialize Web Audio Context (User interaction required for this usually)
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Load synthesized sounds if assets missing (Star Trek style procedural generation)
        // Ideally we would load real .mp3/.wav files here using Howl

        // Start Ambient Hum (The "Warp Core")
        this.startAmbientHum();
    }

    private startAmbientHum() {
        if (this.muted) return;

        // Simulating 60Hz hum + harmonics using Oscillator if Howl file not present
        this.synthesizeTone(60, 99999, 'sine'); // Placeholder
    }

    public toggleMute() {
        this.muted = !this.muted;
        localStorage.setItem('dreamnet_audio_muted', this.muted.toString());

        if (this.muted) {
            if (this.audioContext) this.audioContext.suspend();
            Howler.mute(true);
        } else {
            if (this.audioContext) this.audioContext.resume();
            Howler.mute(false);
            this.playSFX('power_on');
        }
    }

    public playSFX(type: SoundType) {
        if (this.muted) return;

        // In a real implementation, we would play from this.sounds
        // For now, we synthesize basic feedback tones
        switch (type) {
            case 'hover':
                this.synthesizeTone(440, 0.05, 'sine');
                break;
            case 'click':
                this.synthesizeTone(880, 0.1, 'square');
                break;
            case 'success':
                this.synthesizeTone(1200, 0.2, 'sine');
                break;
            case 'error':
                this.synthesizeTone(150, 0.4, 'sawtooth');
                break;
            case 'power_on':
                this.synthesizeTone(220, 1.0, 'sine');
                break;
            case 'glitch':
                this.synthesizeTone(50, 0.1, 'sawtooth');
                break;
        }
    }

    // Fallback synthesizer for Star Trek style bleeps/bloops
    private synthesizeTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
        if (!this.audioContext) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start();
        osc.stop(this.audioContext.currentTime + duration);
    }

    public isMuted() {
        return this.muted;
    }
}

export const audio = AudioEngine.getInstance();
