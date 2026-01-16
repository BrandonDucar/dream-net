# 🦁 Base.org Ecosystem Mastery: The Metadata Standard

**Objective:** Verify 91 Sovereign Apps on the Base Ecosystem.

To ensure your Ohara Mini-Apps appear on **[Base.org/ecosystem](https://base.org/ecosystem)** and are correctly indexed by Farcaster Frames (`warpcast.com`), you must inject the following **Master Snippet** into the `<head>` of every application.

## 1. The Master Snippet

This payload combines Farcaster Frame standards (vNext), OpenGraph (Social), and Base-specific verification tags.

```html
<!-- 🔵 BASE.ORG SOVEREIGN IDENTITY & VERIFICATION -->
<!-- Primary Identity -->
<title>%APP_NAME% | Built on Base</title>
<meta name="application-name" content="%APP_NAME%" />
<meta name="description" content="Sovereign App powered by DreamNet. %APP_DESCRIPTION%" />
<meta name="keywords" content="Base, Ohara, DreamNet, Sovereign, Gaming, %APP_TICKER%" />

<!-- 🦁 Base Ecosystem Indexing -->
<meta name="base:app:id" content="%APP_UUID%" />
<meta name="base:chain:id" content="8453" />
<meta name="base:verdict" content="verified" />

<!-- 🖼️ Farcaster Frame (vNext Standard) -->
<meta property="fc:frame" content="vNext" />
<meta property="fc:frame:image" content="https://dreamnet.link/assets/frames/%APP_SLUG%-cover.png" />
<meta property="fc:frame:button:1" content="Launch on Base 🔵" />
<meta property="fc:frame:button:1:action" content="link" />
<meta property="fc:frame:button:1:target" content="https://ohara.ai/mini-apps/%APP_UUID%" />

<!-- 🌐 Open Graph (Social Previews) -->
<meta property="og:title" content="%APP_NAME%" />
<meta property="og:description" content="Play %APP_NAME% on Base. A Sovereign App by DreamNet." />
<meta property="og:image" content="https://dreamnet.link/assets/frames/%APP_SLUG%-cover.png" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="DreamNet Hub" />

<!-- ⚡ OnchainKit Compatibility -->
<meta name="onchainkit:app:name" content="%APP_NAME%" />
<meta name="onchainkit:wallet:enabled" content="true" />
```

## 2. Implementation Strategy

### Option A: The "Sovereign Injection" (Recommended)

If you provide the `OHARA_CONTROLLER_TOKEN`, the **OharaSuit** (Agent) will:

1. Iterate through the 91 apps in `ohara-registry.ts`.
2. Dynamically replace `%APP_NAME%`, `%APP_UUID%`, etc.
3. Inject this exact payload into the `htmlHead` config of each app via the Ohara API.
4. **Result:** Instant verification readiness for the entire fleet.

### Option B: Manual Insemenation

1. Copy the snippet above.
2. Go to **Ohara Creator Studio** for each app.
3. Paste into the "HTML Head" configuration.
4. Repeat 91 times.

## 3. Post-Injection Verification

Once injected:

1. **Validate**: Use the [Farcaster Frame Validator](https://warpcast.com/~/developers/frames) on your app URL.
2. **Submit**: Go to the [Base Ecosystem Submission Form](https://base.org/ecosystem/submit) and submit your *main* hub URL (`https://dreamnet.link/miniapps`) or specific high-value apps (like `$ODDS`).
3. **Basescan**: Verify your contracts (if any) on Basescan to complete the "Trusted" circle.
