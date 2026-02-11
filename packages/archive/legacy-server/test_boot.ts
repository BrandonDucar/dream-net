
(async () => {
    try {
        console.log("Attempting import...");
        const { DreamNetOSCore } = await import("@dreamnet/dreamnet-os-core");
        console.log("✅ Import Success!");
        console.log("Keys:", Object.keys(DreamNetOSCore));
    } catch (e) {
        console.error("❌ Import Failed:", e);
    }
})();
