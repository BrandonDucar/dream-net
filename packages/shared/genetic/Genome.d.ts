/**
 * 🧬 Genome: The Evolutionary Blueprint
 *
 * Defines the structure of evolvable parameters for agents.
 */
export interface Gene<T = number | boolean | string> {
    name: string;
    value: T;
    min?: number;
    max?: number;
    mutationRate: number;
}
export interface Genome {
    strain: string;
    generation: number;
    genes: Record<string, Gene<any>>;
    fitness?: number;
}
/**
 * Mutates a genome based on individual gene mutation rates.
 */
export declare function mutateGenome(genome: Genome): Genome;
