import { swarmPheromones } from './core/SwarmPheromoneService.js';
console.log("✅ SwarmPheromoneService loaded successfully.");
await swarmPheromones.markTrail('test-path', true, 0.5);
console.log("✅ Pheromone marked.");
