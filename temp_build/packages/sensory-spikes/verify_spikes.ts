
import {
    MetalsSpike,
    CryptoSpike,
    WeatherSpike,
    StockSpike,
    ScienceSpike,
    NewsSpike,
    CultureSpike,
    AegisSpike
} from './src/index';

async function verifySpikes() {
    console.log("👁️  OPENING DREAMNET EYES...");

    const spikes = [
        new MetalsSpike(),
        new CryptoSpike(),
        new WeatherSpike(),
        new StockSpike(),
        new ScienceSpike(),
        new NewsSpike(),
        new CultureSpike(),
        new AegisSpike()
    ];

    for (const spike of spikes) {
        console.log(`\n🔌 Connecting ${spike.name}...`);
        try {
            const result = await spike.fetch();
            console.log(`✅ [${result.source}] Confidence: ${result.confidence}`);

            // Specialized logging for visual verification
            if (spike.name === 'AegisSpike') {
                const d = result.data as any;
                console.log(`   🛸 Drones/Aircraft Detected: ${d.total_detected}`);
                console.log(`   🚁 Low Altitude Targets: ${d.low_altitude_count}`);
            } else if (spike.name === 'MetalsSpike') {
                const d = result.data as any;
                // Handle demo/real structure
                const gold = d.rates?.XAU || d.XAU;
                console.log(`   🏆 Gold Price: ${gold}`);
            } else if (spike.name === 'CryptoSpike') {
                const d = result.data.bitcoin ? result.data : { bitcoin: { usd: 'ERR' } };
                const btc = d.bitcoin?.usd ?? 'err';
                const eth = d.ethereum?.usd ?? 'err';
                console.log(`   🪙 Bitcoin: $${btc} | ETH: $${eth}`);
            } else if (spike.name === 'WeatherSpike') {
                const d = result.data;
                const temp = d.current?.temperature_2m ?? 'N/A';
                console.log(`   🌧️ Temp: ${temp}°C`);
            } else if (spike.name === 'ScienceSpike') {
                const d = result.data;
                const ast = d.wazardous_asteroids_count ?? 0;
                console.log(`   ☄️ Potential Hazardous Asteroids: ${ast}`);
            } else if (spike.name === 'NewsSpike') {
                const articles = result.data.articles || [];
                console.log(`   📰 Top Headline: ${articles[0]?.title ?? 'No News'}`);
            } else if (spike.name === 'StockSpike') {
                const spx = result.data.SPX?.price ?? 'N/A';
                console.log(`   📈 S&P 500: ${spx}`);
            }
            console.log(`❌ ${spike.name} FAILED:`, err);
        }
    }

    console.log("\n✨ SENSORY VERIFICATION COMPLETE");
}

verifySpikes();
