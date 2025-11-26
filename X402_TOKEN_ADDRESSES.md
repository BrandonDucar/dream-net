# X402 Token Contract Addresses

## ✅ Confirmed Addresses

### Binance Smart Chain (BSC) - Primary Network
- **Contract:** `0x1e8e4145506e74996f32b61de2f7f4ec60f2d102`
- **Type:** BEP20
- **Price:** ~$0.0000000000001193 USD per token
- **Market Cap:** ~$47,990 USD
- **Total Supply:** 402 quadrillion X402 tokens
- **Holders:** 4,340 addresses
- **Status:** ✅ Confirmed

### Ethereum Mainnet
- **Contract:** `0x1e8e4145506e74996f32b61de2f7f4ec60f2d102`
- **Type:** ERC20
- **Price:** ~$0.0000000000001266 USD per token
- **FDV:** ~$50,910 USD
- **Total Supply:** 402 quadrillion X402 tokens
- **Holders:** 2,280 addresses
- **Status:** ✅ Confirmed

### Solana
- **Contract:** `6H8uyjyrpvcra6fi7iwh29dxsm8kctzhhryxmpwkpump`
- **Type:** SPL Token
- **Price:** ~$0.000048111 USD per token
- **Market Cap:** ~$81,000 USD
- **Liquidity:** ~$37,000 USD
- **Status:** ✅ Confirmed

## ⚠️ Needs Verification

### Base Mainnet
- **Contract:** `0x1e8e4145506e74996f32b61de2f7f4ec60f2d102` (using BSC address as fallback)
- **Status:** ⚠️ **NEEDS VERIFICATION** - May need to bridge X402 to Base or use different address
- **Action:** Check if X402 is bridged to Base, or if we need to deploy/bridge it

### Polygon
- **Contract:** `0x1e8e4145506e74996f32b61de2f7f4ec60f2d102` (using BSC address as fallback)
- **Status:** ⚠️ **NEEDS VERIFICATION** - May need to bridge X402 to Polygon or use different address
- **Action:** Check if X402 is bridged to Polygon, or if we need to deploy/bridge it

## 💰 Cost Analysis

**YES - X402 tokens are EXTREMELY cheap!**

- **Per Token:** ~$0.0000000000001193 USD (BSC/Ethereum)
- **Per Million Tokens:** ~$0.0001193 USD
- **Per Billion Tokens:** ~$0.1193 USD
- **Per Trillion Tokens:** ~$119.30 USD

**Transaction Costs:**
- **Base:** ~$0.01-0.05 per transaction (very cheap)
- **Polygon:** ~$0.001-0.01 per transaction (extremely cheap)
- **Ethereum:** ~$1-10 per transaction (expensive)
- **Solana:** ~$0.00025 per transaction (cheapest)
- **BSC:** ~$0.10-0.50 per transaction (cheap)

**Recommendation:** Use **Base** or **Polygon** for X402 payments - both are very cheap for transactions!

## 🔧 Environment Variables

Add these to your `.env`:

```bash
# X402 Token Contract Addresses
X402_TOKEN_BASE=0x1e8e4145506e74996f32b61de2f7f4ec60f2d102  # ⚠️ Verify this is correct for Base
X402_TOKEN_ETHEREUM=0x1e8e4145506e74996f32b61de2f7f4ec60f2d102
X402_TOKEN_POLYGON=0x1e8e4145506e74996f32b61de2f7f4ec60f2d102  # ⚠️ Verify this is correct for Polygon
X402_TOKEN_SOLANA=6H8uyjyrpvcra6fi7iwh29dxsm8kctzhhryxmpwkpump
X402_TOKEN_BSC=0x1e8e4145506e74996f32b61de2f7f4ec60f2d102
```

## 📝 Next Steps

1. **Verify Base Address:** Check if X402 is bridged to Base or if we need to use a different address
2. **Verify Polygon Address:** Check if X402 is bridged to Polygon or if we need to use a different address
3. **Test Transactions:** Test X402 transfers on Base/Polygon to verify addresses work
4. **Update Code:** Once verified, update the addresses in `X402PaymentGateway.ts`

## 🔗 Resources

- CoinMarketCap: https://coinmarketcap.com/currencies/x402/
- BSC Contract: https://bscscan.com/token/0x1e8e4145506e74996f32b61de2f7f4ec60f2d102
- Ethereum Contract: https://etherscan.io/token/0x1e8e4145506e74996f32b61de2f7f4ec60f2d102
- Solana DexScreener: https://dexscreener.com/solana/6h8uyjyrpvcra6fi7iwh29dxsm8kctzhhryxmpwkpump

---

**Status:** ✅ Addresses found, ⚠️ Base/Polygon need verification

