
import { S3Client, CreateBucketCommand, PutBucketCorsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const region = process.env.AWS_REGION || 'us-east-1';
const s3 = new S3Client({ region });

// Unique bucket name (must be globally unique)
const bucketName = `dreamnet-memory-core-${process.env.DREAMNET_AWS_CA_ID?.substring(0, 8) || 'sovereign'}`;

async function provisionStorage() {
    console.log(`[🏗️ Cloud Construction] Provisioning Memory Core: ${bucketName}...`);

    try {
        // 1. Create Bucket
        await s3.send(new CreateBucketCommand({ Bucket: bucketName }));
        console.log(`[✅ Created] Bucket active at s3://${bucketName}`);

        // 2. Configure CORS (To allow OmniDashboard to read images directly)
        await s3.send(new PutBucketCorsCommand({
            Bucket: bucketName,
            CORSConfiguration: {
                CORSRules: [
                    {
                        AllowedHeaders: ["*"],
                        AllowedMethods: ["GET", "PUT", "HEAD"],
                        AllowedOrigins: ["*"], // Restrict this in production!
                        ExposeHeaders: ["ETag"]
                    }
                ]
            }
        }));
        console.log(`[✅ Secured] CORS policies applied for Dashboard access.`);

        console.log(`\n🎉 STORAGE ONLINE. $120 Credit is now fueling infinite memory.`);

    } catch (error) {
        if (error.name === 'BucketAlreadyOwnedByYou') {
            console.log(`[ℹ️ Exists] Bucket ${bucketName} is already yours. We are good.`);
        } else {
            console.error("Provisioning Failed:", error.message);
        }
    }
}

provisionStorage();
