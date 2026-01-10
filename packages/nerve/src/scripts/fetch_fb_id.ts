
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as adsSdk from 'facebook-nodejs-business-sdk';

// Load .env from server package (where we stored the token)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../server/.env') });

async function fetchPageId() {
    const token = process.env.FACEBOOK_ACCESS_TOKEN;
    if (!token) {
        console.error("❌ FACEBOOK_ACCESS_TOKEN not found in .env");
        process.exit(1);
    }

    console.log("🔍 Scanning for Pages...");
    const api = adsSdk.FacebookAdsApi.init(token);

    try {
        // Fetch User's Accounts (Pages)
        // Note: SDK typing and usage can be tricky, using 'me' edge
        const user = new adsSdk.User('me');
        const accounts = await user.getAccounts(['name', 'id']);

        console.log(`\n📄 Found ${accounts.length} Page(s):`);

        let targetId = null;

        accounts.forEach((page: any) => {
            console.log(`- [${page.name}] ID: ${page.id}`);
            if (page.name.includes("Ducar")) {
                targetId = page.id;
            }
        });

        if (targetId) {
            console.log(`\n✅ MATCH FOUND: Ducar Consulting ID = ${targetId}`);
        } else {
            console.log("\n⚠️ No 'Ducar' page found explicitly. Please review the list above.");
        }

    } catch (error) {
        console.error("\n❌ FETCH FAILED:", error);
    }
}

fetchPageId();
