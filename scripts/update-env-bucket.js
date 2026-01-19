
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../.env');
const bucketName = 'dreamnet-memory-core-80b47339'; // Using the ID we have

if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, 'utf8');
    const key = 'AWS_S3_BUCKET';

    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(content)) {
        content = content.replace(regex, `${key}=${bucketName}`);
    } else {
        content += `\n${key}=${bucketName}`;
    }

    fs.writeFileSync(envPath, content, 'utf8');
    console.log(`Saved ${bucketName} to .env`);
}
