# 🔐 The Secure Vault

This directory contains the **Real Payloads** for high-value assets.
The `BazaarCashier` checks this folder before dispensing a product.

## How to Stock Inventory

Create JSON files matching the product name to deliver real content.

### Example: ZERO_DAY_PACKET

Create `ZERO_DAY_PACKET.json`:

```json
{
  "target": "0x123...TargetContract",
  "vulnerability": "Reentrancy",
  "exploit_code": "function attack() { ... }"
}
```

### Example: QUANTUM_MESH_SHIELD

Create `QUANTUM_MESH_SHIELD.json`:

```json
{
  "key_type": "KYBER-512",
  "private_material": "-----BEGIN PRIVATE KEY-----..."
}
```

### Example: SKY_NET_DRONE_LEASE

Create `SKY_NET_DRONE_LEASE.json`:

```json
{
  "drone_id": "UAV-99",
  "stream_url": "rtmp://192.168.1.50/live",
  "access_token": "sk_live_123456"
}
```

## ⚠️ WARNING

**ANYTHING IN THIS FOLDER WILL BE SENT TO THE USER WHO PAYS.**
Do not put sensitive system keys here. Only put the *product* you want to sell.
