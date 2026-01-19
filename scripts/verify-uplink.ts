
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const region = process.env.AWS_REGION || 'us-east-1';

async function verifyUplink() {
    console.log(`[Cloud Uplink] Initializing Connection (Region: ${region})...`);

    try {
        // 1. Verify Identity
        const sts = new STSClient({ region });
        const identity = await sts.send(new GetCallerIdentityCommand({}));
        console.log(`[Identity Verified] Configured as User: ${identity.Arn}`);
        console.log(`[Account ID] ${identity.Account}`);

        // 2. Test Storage Access (Simple Read)
        const s3 = new S3Client({ region });
        const buckets = await s3.send(new ListBucketsCommand({}));

        console.log(`[Storage Access] Success. Found ${buckets.Buckets?.length || 0} buckets.`);
        if (buckets.Buckets && buckets.Buckets.length > 0) {
            buckets.Buckets.forEach(b => console.log(` - 📦 ${b.Name}`));
        } else {
            console.log(" - No buckets found (Fresh Account). Ready to create.");
        }

        console.log("\n✅ FULL CLOUD UPLINK ESTABLISHED.");

    } catch (error) {
        console.error("\n❌ UPLINK FAILED:", error.message);
        if (error.name === 'InvalidSignatureException') {
            console.error(" - HINT: Check Access Key/Secret accuracy.");
        }
    }
}

verifyUplink();
