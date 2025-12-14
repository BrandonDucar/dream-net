import { readFileSync } from 'fs';

const data = JSON.parse(readFileSync('registry.json', 'utf-8'));
const active = data.filter(g => g.status === 'Active');
const names = active.map(g => g.name);
const unique = [...new Set(names)];

console.log(`Total entries: ${data.length}`);
console.log(`Active entries: ${active.length}`);
console.log(`Unique active names: ${unique.length}`);

// Find duplicates
const nameCounts = {};
names.forEach(name => {
  nameCounts[name] = (nameCounts[name] || 0) + 1;
});

const duplicates = Object.entries(nameCounts).filter(([name, count]) => count > 1);

if (duplicates.length > 0) {
  console.log('\nDuplicates found:');
  duplicates.forEach(([name, count]) => {
    console.log(`  "${name}": ${count} times`);
    // Show which entries
    active.filter(g => g.name === name).forEach((g, idx) => {
      console.log(`    Entry ${idx + 1}: category="${g.category}", link=${g.link || 'null'}`);
    });
  });
} else {
  console.log('\nNo duplicates found');
}

