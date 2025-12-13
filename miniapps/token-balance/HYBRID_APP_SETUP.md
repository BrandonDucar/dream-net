# Hybrid App Setup ✅

## What is a Hybrid App?

A **hybrid app** works in **both** environments:
- ✅ **Base App** (Farcaster client) - Discoverable, automatic wallet connection
- ✅ **Standalone Browser** - Direct URL access, manual wallet connection

## Current Setup

### ✅ OnchainKit Configuration
- `OnchainKitProvider` configured for Base chain
- Wallet connection works in both environments
- Automatic detection of Base App vs browser

### ✅ Environment Detection
- `isBaseApp()` - Detects if running in Base App
- `getEnvironment()` - Returns environment context
- Optimized UX for each environment

### ✅ Features
- **Base App**: Automatic wallet connection, optimized UI
- **Browser**: Manual wallet connection, full features
- **Both**: Same functionality, seamless experience

## How It Works

### In Base App:
1. User discovers app in Base App directory
2. App opens with automatic wallet connection
3. Token balance displays immediately
4. Badge shows "Running in Base App"

### In Browser:
1. User visits URL directly
2. User clicks "Connect Wallet"
3. Wallet modal appears
4. After connection, token balance displays

## Benefits

✅ **Single codebase** - One app, two environments  
✅ **Automatic detection** - Knows where it's running  
✅ **Optimized UX** - Tailored experience per environment  
✅ **Discoverable** - Appears in Base App directory  
✅ **Accessible** - Works standalone too  

## Deployment

1. Deploy to Vercel
2. Set up manifest (`.well-known/farcaster.json`)
3. Submit to Base App directory
4. App works in both places!

## Testing

### Test in Base App:
- Open Base App
- Search for "Token Balance"
- Launch app
- Should auto-connect wallet

### Test in Browser:
- Visit `https://token-balance-dreamnet.vercel.app`
- Click "Connect Wallet"
- Connect MetaMask/Coinbase Wallet
- Should show balance

