import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');
const target = resolve(__dirname, '../../../../../circulatory/memory-dna/src/index.js');

console.log(`__dirname: ${__dirname}`);
console.log(`target: ${target}`);
