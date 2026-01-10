/**
 * EVOLUTION ENGINE (Genetic Algorithms)
 * "The System Evolves."
 */

export interface DNA<T> {
    genes: T;
    fitness: number;
}

export class EvolutionEngine<T> {
    constructor(
        private populationSize: number,
        private mutationRate: number,
        private fitnessFunction: (genes: T) => number,
        private crossoverFunction: (parentA: T, parentB: T) => T,
        private mutationFunction: (genes: T) => T
    ) { }

    /**
     * Run one generation of evolution.
     */
    evolve(population: DNA<T>[]): DNA<T>[] {
        // 1. Selection (Survival of the Fittest)
        const survivors = this.select(population);

        // 2. Crossover & Mutation (The Next Generation)
        const nextGen: DNA<T>[] = [];
        while (nextGen.length < this.populationSize) {
            const parentA = this.randomChoice(survivors);
            const parentB = this.randomChoice(survivors);

            let childGenes = this.crossoverFunction(parentA.genes, parentB.genes);

            if (Math.random() < this.mutationRate) {
                childGenes = this.mutationFunction(childGenes);
            }

            nextGen.push({
                genes: childGenes,
                fitness: this.fitnessFunction(childGenes)
            });
        }

        // Return sorted by fitness
        return nextGen.sort((a, b) => b.fitness - a.fitness);
    }

    private select(population: DNA<T>[]): DNA<T>[] {
        // Sort by fitness and keep top 50%
        return population.sort((a, b) => b.fitness - a.fitness)
            .slice(0, Math.floor(this.populationSize / 2));
    }

    private randomChoice(list: DNA<T>[]): DNA<T> {
        return list[Math.floor(Math.random() * list.length)];
    }
}
