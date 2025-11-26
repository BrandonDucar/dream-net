#!/usr/bin/env tsx
/**
 * Navigate to Profile Picture Settings
 * 
 * Opens all platform profile picture upload pages in browser tabs
 */

const PROFILE_PICTURE_URLS = [
  {
    name: "Reddit",
    url: "https://www.reddit.com/settings/profile",
    image: "primary"
  },
  {
    name: "Twitter/X",
    url: "https://x.com/settings/profile",
    image: "primary"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/accounts/edit/",
    image: "primary"
  },
  {
    name: "TikTok",
    url: "https://www.tiktok.com/setting",
    image: "primary"
  },
  {
    name: "Facebook",
    url: "https://www.facebook.com/settings?tab=profile",
    image: "primary"
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/me/profile-edit/",
    image: "primary"
  },
  {
    name: "GitHub",
    url: "https://github.com/settings/profile",
    image: "primary"
  },
  {
    name: "YouTube",
    url: "https://studio.youtube.com/",
    image: "primary"
  },
  {
    name: "Farcaster",
    url: "https://warpcast.com/~/settings",
    image: "secondary"
  }
];

console.log("🎨 Profile Picture Setup URLs\n");
console.log("=" .repeat(50));

PROFILE_PICTURE_URLS.forEach((platform, index) => {
  console.log(`\n${index + 1}. ${platform.name}`);
  console.log(`   URL: ${platform.url}`);
  console.log(`   Image: ${platform.image === "primary" ? "Hooded Figure (Red Visor)" : "Robot Creature"}`);
});

console.log("\n\n📋 Instructions:");
console.log("1. Open each URL in your browser");
console.log("2. Log in if needed");
console.log("3. Upload the appropriate image");
console.log("4. Save changes");

console.log("\n🖼️ Image Files Needed:");
console.log("- Primary: Hooded figure with red visor (for most platforms)");
console.log("- Secondary: Spherical robot creature (for Farcaster)");

