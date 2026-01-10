import { spawn } from 'child_process';
import readline from 'readline';

// THE MASTER GRID
// "Choose your Reality."

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.clear();
console.log('================================================');
console.log('🌐  DREAMNET: UNIVERSAL OBSERVABILITY GRID  🌐');
console.log('================================================');
console.log('1. 🏗️  Construction Vertical (Operation Concrete)');
console.log('2. 🏎️  Automotive Vertical (Operation Velocity)');
console.log('3. 🧬  Evolution Engine (Genetic Algo Test)');
console.log('0. ❌  Exit');
console.log('================================================');

rl.question('Select Node > ', (answer) => {
    rl.close();

    let script = '';
    if (answer === '1') {
        script = 'packages/construction-core/cli.ts';
    } else if (answer === '2') {
        script = 'packages/automotive-core/cli.ts';
    } else if (answer === '3') {
        console.log('Evolution Engine not yet CLI ready.');
        process.exit(0);
    } else {
        process.exit(0);
    }

    if (script) {
        console.log(`\nBooting Node: ${script}...\n`);
        const child = spawn('npx', ['tsx', script], { stdio: 'inherit', shell: true });

        child.on('close', (code) => {
            console.log(`\n[Grid] Node shutdown (Code: ${code}).`);
        });
    }
});
