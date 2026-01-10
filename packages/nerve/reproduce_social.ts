
console.log("Testing imports...");
try {
    await import('instagram-private-api');
    console.log("✅ instagram-private-api loaded");
} catch (e) {
    console.error("❌ instagram-private-api failed:", e);
}

try {
    await import('facebook-nodejs-business-sdk');
    console.log("✅ facebook-nodejs-business-sdk loaded");
} catch (e) {
    console.error("❌ facebook-nodejs-business-sdk failed:", e);
}
