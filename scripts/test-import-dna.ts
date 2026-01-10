import { memorySystem } from '@dreamnet/memory-dna';
console.log('--- 🧠 MEMORY GENESIS CHECK ---');
console.log('Memory System Alias Resolved:', memorySystem !== undefined);
if (memorySystem) {
    console.log('Lizard:', memorySystem.lizard.name);
    console.log('Mammal:', memorySystem.mammal.name);
    console.log('Cosmic:', memorySystem.cosmic.name);
}
