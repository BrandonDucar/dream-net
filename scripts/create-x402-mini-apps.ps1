# Create X402 Mini Apps
# Scaffolds new X402-powered mini apps for Base

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "🚀 X402 Mini Apps Generator" -ForegroundColor Cyan
Write-Host "=" * 70 -ForegroundColor Cyan
Write-Host ""

# X402 Mini Apps to create
$X402_APPS = @(
    @{
        Id = "x402-payment-gateway"
        Name = "X402 Payment Gateway"
        Description = "Multi-chain X402 payment processor for DreamNet agents"
        Features = @("Multi-chain support", "Real-time settlement", "Balance queries", "Payment history")
    },
    @{
        Id = "x402-balance-viewer"
        Name = "X402 Balance Viewer"
        Description = "Check X402 balances across all chains (BSC, Ethereum, Solana)"
        Features = @("Multi-chain balances", "Token conversion", "Transaction history")
    },
    @{
        Id = "x402-service-marketplace"
        Name = "X402 Service Marketplace"
        Description = "List and discover X402-powered services"
        Features = @("Service listings", "Service discovery", "Pricing", "Reviews")
    },
    @{
        Id = "x402-transaction-history"
        Name = "X402 Transaction History"
        Description = "View complete X402 payment history"
        Features = @("Transaction feed", "Filtering", "Export", "Analytics")
    },
    @{
        Id = "x402-multi-chain-bridge"
        Name = "X402 Multi-Chain Bridge"
        Description = "Bridge X402 tokens across chains"
        Features = @("Cross-chain transfers", "Low fees", "Real-time settlement")
    }
)

$BASE_DIR = "packages/base-mini-apps"
$FRONTEND_DIR = "$BASE_DIR/frontend"
$CONTRACTS_DIR = "$BASE_DIR/contracts"

# Check if directories exist
if (-not (Test-Path $BASE_DIR)) {
    Write-Host "❌ Base mini-apps directory not found: $BASE_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Creating $($X402_APPS.Count) X402 Mini Apps..." -ForegroundColor Yellow
Write-Host ""

foreach ($app in $X402_APPS) {
    $appId = $app.Id
    $appName = $app.Name
    $appDir = "$FRONTEND_DIR/$appId"
    
    Write-Host "▶ Creating: $appName ($appId)" -ForegroundColor Cyan
    
    # Create directory
    if (Test-Path $appDir) {
        Write-Host "  ⚠ Directory already exists, skipping..." -ForegroundColor Yellow
        continue
    }
    
    New-Item -ItemType Directory -Path $appDir -Force | Out-Null
    
    # Create React component
    $componentCode = @"
import React, { useState, useEffect } from 'react';
import { Base } from '@base/base-sdk';
import './$appId.css';

/**
 * $appName
 * 
 * $($app.Description)
 * 
 * Features:
$($app.Features | ForEach-Object { " * - $_" })
 */
export function ${($appId -replace '-', ' ' -split ' ' | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''}() {
  const [base, setBase] = useState<Base | null>(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize Base SDK
    const initBase = async () => {
      try {
        const baseSDK = new Base();
        await baseSDK.connect();
        setBase(baseSDK);
        setConnected(true);
      } catch (error) {
        console.error('Failed to connect to Base:', error);
      } finally {
        setLoading(false);
      }
    };

    initBase();
  }, []);

  if (loading) {
    return (
      <div className="$appId-container">
        <div className="loading">Loading $appName...</div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="$appId-container">
        <div className="error">Please connect your wallet to use $appName</div>
      </div>
    );
  }

  return (
    <div className="$appId-container">
      <div className="$appId-header">
        <h1>$appName</h1>
        <p>$($app.Description)</p>
      </div>
      
      <div className="$appId-content">
        <div className="feature-list">
          <h2>Features</h2>
          <ul>
$($app.Features | ForEach-Object { "            <li>$_</li>" })
          </ul>
        </div>
        
        <div className="coming-soon">
          <p>🚧 This mini app is under development</p>
          <p>X402 integration coming soon!</p>
        </div>
      </div>
    </div>
  );
}
"@
    
    # Write component
    Set-Content -Path "$appDir/$appId.tsx" -Value $componentCode
    
    # Create CSS
    $cssCode = @"
.$appId-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.$appId-header {
  text-align: center;
  margin-bottom: 2rem;
}

.$appId-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.$appId-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.feature-list ul {
  list-style: none;
  padding: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.coming-soon {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
}
"@
    
    Set-Content -Path "$appDir/$appId.css" -Value $cssCode
    
    Write-Host "  ✅ Created: $appDir" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ X402 Mini Apps Created!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Register apps in packages/base-mini-apps/frontend/index.tsx"
Write-Host "2. Add routes in client/src/pages/"
Write-Host "3. Integrate X402 Payment Gateway API"
Write-Host "4. Test with Base SDK"
Write-Host ""

