import { NeynarAPIClient } from "@neynar/nodejs-sdk";

// 🔒 Force production Neynar API base path — never allow dev-studio DNS
// SDK v1.71.0: constructor(apiKey, { basePath, baseOptions, ... })
// The dev-studio.neynar.com subdomain caused 2,800+ consecutive DNS failures.
const client = new NeynarAPIClient(
    process.env.NEYNAR_API_KEY || "",
    { basePath: "https://api.neynar.com" }
);

export async function publishToFarcaster(text: string, ipfsHash?: string) {
    if (!process.env.NEYNAR_API_KEY) {
        return { status: 'mocked', text };
    }

    try {
        const message = ipfsHash
            ? `${text}\n\nProvenance: https://gateway.pinata.cloud/ipfs/${ipfsHash}`
            : text;
        const cast = await client.publishCast(process.env.NEYNAR_SIGNER_UUID || "", message);
        return { status: 'published', hash: cast.hash };
    } catch (error: any) {
        throw new Error(`Farcaster Publish Failed: ${error?.message || error}`);
    }
}
