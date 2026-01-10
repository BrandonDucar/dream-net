
import { strict as assert } from 'node:assert';
import { getSpiralCoordinate, getHexNeighbors, getHexDistance, areHexEqual } from '../logic/honeycomb.js';

console.log('🐝 Running Honeycomb Logic Tests...');

// Test 1: Center
const center = getSpiralCoordinate(0);
assert.ok(targetIsExpected(center, { q: 0, r: 0, s: 0 }), 'Center should be 0,0,0');
console.log('✅ Center (0,0,0) Verified');

// Test 2: First Ring (Neighbors of Center)
// Spiral index 1 should be neighbor of 0
const one = getSpiralCoordinate(1);
const distance = getHexDistance(center, one);
assert.equal(distance, 1, 'Index 1 should be distance 1 from center');
console.log('✅ Spiral Ring 1 Verified');

// Test 3: Consistency
// Expanding 100 spots
const seen = new Set<string>();
for (let i = 0; i < 100; i++) {
    const c = getSpiralCoordinate(i);
    const key = `${c.q},${c.r},${c.s}`;
    if (seen.has(key)) {
        throw new Error(`Duplicate coordinate found at index ${i}: ${key}`);
    }
    seen.add(key);
}
console.log('✅ Unique Expansion Verified (100 Nodes)');

// Test 4: Neighbors
const neighbors = getHexNeighbors(center);
assert.equal(neighbors.length, 6, 'Center must have 6 neighbors');
console.log('✅ Neighbor Expansion Verified');


function targetIsExpected(actual: any, expected: any) {
    return actual.q === expected.q && actual.r === expected.r && actual.s === expected.s;
}

console.log('🎉 ALL HONEYCOMB TESTS PASSED');
