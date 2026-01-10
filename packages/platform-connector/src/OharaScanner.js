import { Neynar } from "./NeynarClient.js";
export class OharaScanner {
    async scan() {
        console.log("📡 [OharaScanner] Querying Neynar for 'ohara.ai/mini-apps'...");
        // Search for the specific domain mentioned in casts
        const casts = await Neynar.searchCasts("ohara.ai/mini-apps");
        return casts.map(cast => {
            // Simple regex to extract the UUID-like part of the ohara URL
            const match = cast.text.match(/ohara\.ai\/mini-apps\/([a-zA-Z0-9-]+)/);
            const uuid = match ? match[1] : `legacy-${cast.hash.slice(0, 8)}`;
            return {
                uuid,
                url: match ? `https://${match[0]}` : `https://ohara.ai/mini-apps/${uuid}`,
                name: cast.author.display_name ? `${cast.author.display_name}'s App` : "Discovered App",
                foundInCast: cast.hash
            };
        });
    }
}
//# sourceMappingURL=OharaScanner.js.map