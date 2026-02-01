
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'aqueous-tube-470317-m6';
const REGION = process.env.GCP_REGION || 'us-central1';
const WORKFLOW_NAME = 'dreamnet-orchestrator';
const SERVICE_NAME = 'dreamnet';

console.log(`🚀 Deploying DreamNet Orchestrator Workflow...`);
console.log(`📋 Config: Project=${PROJECT_ID}, Region=${REGION}`);

try {
    // Step 1: Get Service URL
    console.log('🔗 Retrieving Cloud Run Service URL...');
    const serviceUrl = execSync(
        `gcloud run services describe ${SERVICE_NAME} --region ${REGION} --project ${PROJECT_ID} --format="value(status.url)"`,
        { encoding: 'utf-8' }
    ).trim();

    if (!serviceUrl) {
        throw new Error('Could not retrieve Service URL');
    }
    console.log(`✅ Service URL: ${serviceUrl}`);

    // Step 2: Read Workflow YAML
    const yamlPath = join(process.cwd(), 'infrastructure/google/workflows/main_orchestrator.yaml');
    let yamlContent = readFileSync(yamlPath, 'utf-8');

    // Step 3: Inject Service URL
    // Replace the default localhost/example URL with the actual Cloud Run URL
    yamlContent = yamlContent.replace(
        /service_url: ".*"/,
        `service_url: "${serviceUrl}"`
    );

    const genPath = join(process.cwd(), 'infrastructure/google/workflows/main_orchestrator.gen.yaml');
    writeFileSync(genPath, yamlContent);
    console.log('✅ Generated workflow config with active Service URL');

    // Step 4: Deploy Workflow
    console.log('☁️  Deploying Workflow to Google Cloud...');
    execSync(
        `gcloud workflows deploy ${WORKFLOW_NAME} ` +
        `--source=${genPath} ` +
        `--location=${REGION} ` +
        `--project=${PROJECT_ID}`,
        { stdio: 'inherit' }
    );

    console.log(`\n🎉 Workflow deployed successfully!`);
    console.log(`👉 View in Console: https://console.cloud.google.com/workflows/workflow/${REGION}/${WORKFLOW_NAME}/dashboard?project=${PROJECT_ID}`);

} catch (error) {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
}
