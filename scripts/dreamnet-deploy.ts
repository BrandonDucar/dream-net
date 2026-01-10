
import { NetlifyDeploymentProvider } from '../packages/deployment-core/src/index';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMission() {
    console.log('🚀 Starting DreamNet Deployment Mission...');
    console.log('----------------------------------------');

    const provider = new NetlifyDeploymentProvider();

    // 1. Scan Phase
    console.log('\n📡 Phase 1: Scanning Netlify Infrastructure...');
    const sites = await provider.listDeployments();

    if (sites.length > 0) {
        console.log(`✅ Found ${sites.length} existing sites:`);
        sites.forEach(site => {
            console.log(`   - ${site.url} (ID: ${site.deploymentId})`);
        });
    } else {
        console.log('⚠️  No sites found or scan failed (check auth/CLI status).');
    }

    // 2. Build Phase
    console.log('\n🔨 Phase 2: Ensuring Clean Build...');
    try {
        console.log('   Running pnpm run build...');
        // We run this in the client directory
        await execAsync('cd client && pnpm run build');
        console.log('✅ Build successful!');
    } catch (error: any) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }

    // 3. Deploy Phase
    console.log('\n🚀 Phase 3: Pushing Clean Deploy...');
    const result = await provider.deploy({
        platform: 'netlify',
        projectName: 'dreamnet-client',
        sourceDirectory: 'client',
        outputDirectory: 'client/dist'
    });

    if (result.success) {
        console.log('\n✨ Deployment Successful! ✨');
        console.log(`🌍 Live URL: ${result.url}`);
        console.log(`🆔 Deploy ID: ${result.deploymentId}`);
        if (result.logs) {
            console.log('\n📜 Logs:');
            result.logs.forEach(log => console.log(log));
        }
    } else {
        console.error('\n❌ Deployment Failed!');
        console.error(`Error: ${result.error}`);
        if (result.logs) {
            console.log('Logs:', result.logs);
        }
    }
}

runMission().catch(err => console.error('Mission Critical Failure:', err));
