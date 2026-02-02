import { bondingCurveEngine } from '../packages/organs/nervous/trading-organ/BondingCurveEngine.js';

async function testBondingCurve() {
    console.log('📈 [BondingTest] Initializing Curve for $DREAM...');
    bondingCurveEngine.initializeCurve('DREAM', 0.005);

    const buyAmount = 1; // 1 ETH/Reserve
    const returnTokens = bondingCurveEngine.buy('DREAM', buyAmount, 'Antigravity');
    const stateAfterBuy = bondingCurveEngine.getState('DREAM');

    console.log(`✅ [BondingTest] Bought for ${buyAmount}. Received: ${returnTokens.toFixed(4)} tokens.`);
    console.log(`📊 [BondingTest] New Price: ${stateAfterBuy?.price.toFixed(6)}`);

    const sellAmount = returnTokens / 2;
    const reserveReturned = bondingCurveEngine.sell('DREAM', sellAmount, 'Antigravity');
    const stateAfterSell = bondingCurveEngine.getState('DREAM');

    console.log(`✅ [BondingTest] Sold ${sellAmount.toFixed(4)}. Received: ${reserveReturned.toFixed(4)} reserve.`);
    console.log(`📊 [BondingTest] New Price: ${stateAfterSell?.price.toFixed(6)}`);
}

testBondingCurve();
