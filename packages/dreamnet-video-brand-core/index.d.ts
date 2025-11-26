/**
 * DreamNet Video Brand Core
 *
 * Apply two-color signature (Neon Blue #17D6FF + Raspberry Red #FF2768) to video transformations
 * HSL/Hue curve adjustments, Glow/Bloom effects, Preset system, Skin tone protection
 */
export interface BrandGradingConfig {
    primaryColor: string;
    accentColor: string;
    intensity: "light" | "heavy";
    protectSkinTones: boolean;
    glowIntensity: number;
    bloomIntensity: number;
}
export interface BrandPreset {
    id: string;
    name: string;
    config: BrandGradingConfig;
    lutFile?: string;
}
export declare class BrandGradingCore {
    private presets;
    constructor();
    private initializePresets;
    /**
     * Apply brand grading to video
     */
    applyGrading(videoPath: string, presetId: string, outputPath?: string): Promise<string>;
    /**
     * Create custom brand pair
     */
    createCustomPreset(name: string, primaryColor: string, accentColor: string, intensity?: "light" | "heavy"): BrandPreset;
    /**
     * Get preset by ID
     */
    getPreset(id: string): BrandPreset | undefined;
    /**
     * List all presets
     */
    listPresets(): BrandPreset[];
    /**
     * Generate LUT file from preset
     */
    generateLUT(presetId: string): Promise<string>;
}
export default BrandGradingCore;
