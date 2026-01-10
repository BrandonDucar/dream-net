const { NetlifyAPI } = require('netlify');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');
const execAsync = promisify(exec);

async function deployToNetlify() {
    console.log('🚀 Deploying to Netlify via API...\n');

    try {
        // Read the site ID from .netlify/state.json
        const statePath = path.join(__dirname, '..', 'client', '.netlify', 'state.json');

        if (!fs.existsSync(statePath)) {
            console.error('❌ No .netlify/state.json found. Site not linked.');
            console.log('Run: cd client && netlify link');
            process.exit(1);
        }

        const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
        const siteId = state.siteId;

        console.log(`📡 Site ID: ${siteId}`);
        console.log(`📁 Deploying from: client/dist\n`);

        // Use netlify deploy with the site ID
        const deployCmd = `netlify deploy --prod --dir=dist --site=${siteId} --message="Full DreamNet deployment (hub, miniapps, verticals)"`;

        console.log(`Running: ${deployCmd}\n`);

        const { stdout, stderr } = await execAsync(deployCmd, {
            cwd: path.join(__dirname, '..', 'client'),
            env: { ...process.env, NETLIFY_SITE_ID: siteId }
        });

        console.log('✅ Deployment Output:');
        console.log(stdout);

        if (stderr && !stderr.includes('Netlify Build')) {
            console.log('Warnings:', stderr);
        }

        console.log('\n🎉 Deployment Complete!');

    } catch (error) {
        console.error('\n❌ Deployment Failed:');
        console.error('Error:', error.message);
        if (error.stdout) console.log('Output:', error.stdout);
        if (error.stderr) console.log('Errors:', error.stderr);
        process.exit(1);
    }
}

deployToNetlify();
