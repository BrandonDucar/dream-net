import dotenv from 'dotenv';
import path from 'path';
import { getProjectByName, ensureDomainAttached } from '../packages/organs/integumentary/server/src/integrations/vercelClient.js';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function mapAetherSafe() {
    const domain = 'aethersafe.pro';
    const projectName = process.env.VERCEL_PROJECT_NAME || 'dream-net';

    console.log(`🚀 Mapping ${domain} to Vercel project: ${projectName}...`);

    try {
        const project = await getProjectByName(projectName);
        if (!project) {
            console.error(`❌ Project ${projectName} not found on Vercel.`);
            return;
        }

        console.log(`✅ Found project ${project.name} (${project.id})`);

        const result = await ensureDomainAttached(project.id, domain, true);
        console.log(`✨ Domain ${domain} successfully linked to Vercel.`);
        console.log('🔗 Verification status:', result.verified ? 'Verified' : 'Pending Verification');

        if (result.verification) {
            console.log('\n📝 DNS Records Required:');
            result.verification.forEach((v: any) => {
                console.log(`   Type: ${v.type}`);
                console.log(`   Domain: ${v.domain}`);
                console.log(`   Value: ${v.value}`);
                console.log('---');
            });
        }
    } catch (error: any) {
        console.error(`❌ Failed to map domain: ${error.message}`);
    }
}

mapAetherSafe();
