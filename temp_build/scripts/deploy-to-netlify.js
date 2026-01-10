const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

async function deployToDreamNet() {
    console.log('🚀 Deploying DreamNet to dreamnet.ink...\n');

    try {
        // Deploy to dreamnet.ink using site name
        console.log('📡 Deploying to dreamnet.ink...');
        const dreamnetCmd = 'netlify deploy --prod --dir=client/dist --site=dreamnet';
        console.log(`Running: ${dreamnetCmd}\n`);

        const { stdout: dreamnetOut, stderr: dreamnetErr } = await execAsync(dreamnetCmd);

        console.log('✅ DreamNet.ink Deployment:');
        console.log(dreamnetOut);
        if (dreamnetErr) console.error('Warnings:', dreamnetErr);

        console.log('\n' + '='.repeat(60) + '\n');

        // Also try dadfi.org
        console.log('📡 Deploying to dadfi.org...');
        const dadfiCmd = 'netlify deploy --prod --dir=client/dist --site=dadfi';
        console.log(`Running: ${dadfiCmd}\n`);

        const { stdout: dadfiOut, stderr: dadfiErr } = await execAsync(dadfiCmd);

        console.log('✅ Dadfi.org Deployment:');
        console.log(dadfiOut);
        if (dadfiErr) console.error('Warnings:', dadfiErr);

        console.log('\n🎉 Deployment Complete!');

    } catch (error) {
        console.error('\n❌ Deployment Failed:');
        console.error(error.message);
        console.error('\nStdout:', error.stdout);
        console.error('Stderr:', error.stderr);

        console.log('\n💡 Tip: You may need to run "netlify link" first to associate sites.');
        process.exit(1);
    }
}

deployToDreamNet();
