/**
 * 🧬 Genome: The Evolutionary Blueprint
 *
 * Defines the structure of evolvable parameters for agents.
 */
/**
 * Mutates a genome based on individual gene mutation rates.
 */
export function mutateGenome(genome) {
    const newGenes = {};
    for (const [key, gene] of Object.entries(genome.genes)) {
        let newValue = gene.value;
        if (Math.random() < gene.mutationRate) {
            if (typeof gene.value === 'number') {
                const range = (gene.max || 1) - (gene.min || 0);
                const drift = (Math.random() - 0.5) * range * 0.1; // 10% drift
                newValue = Math.max(gene.min || 0, Math.min(gene.max || 1, gene.value + drift));
            }
            else if (typeof gene.value === 'boolean') {
                newValue = !gene.value;
            }
            // Add string mutation logic if needed (e.g. from a pool)
        }
        newGenes[key] = { ...gene, value: newValue };
    }
    return {
        ...genome,
        generation: genome.generation + 1,
        genes: newGenes,
        fitness: undefined // Reset fitness for new generation
    };
}
//# sourceMappingURL=Genome.js.map