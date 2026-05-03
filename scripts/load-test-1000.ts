/**
 * 🚀 Production Load Test - 1,000 Concurrent Agents
 * Tests DreamNet at scale across all endpoints
 */

import http from "http";

const endpoints = [
  {
    name: "Manager (Gooseclaw)",
    url: "https://dreamnet-gooseclaw.dreamnet-intel.workers.dev/health",
    concurrency: 200,
  },
  {
    name: "Hawk Processor",
    url: "https://hawk-processor.dreamnet-intel.workers.dev/health",
    concurrency: 300,
  },
  {
    name: "Arya Generator",
    url: "https://arya-generator.dreamnet-intel.workers.dev/health",
    concurrency: 300,
  },
  {
    name: "Governor Enforcer",
    url: "https://governor-enforcer.dreamnet-intel.workers.dev/health",
    concurrency: 200,
  },
];

async function loadTest() {
  console.log("🚀 PRODUCTION LOAD TEST - 1,000 CONCURRENT AGENTS");
  console.log("═".repeat(80));
  console.log("");

  const results = {
    total_requests: 0,
    successful: 0,
    failed: 0,
    latencies: [],
    start_time: Date.now(),
  };

  const promises = [];

  for (const endpoint of endpoints) {
    for (let i = 0; i < endpoint.concurrency; i++) {
      const promise = (async () => {
        const start = Date.now();
        try {
          const response = await fetch(endpoint.url, { timeout: 10000 });
          const latency = Date.now() - start;

          results.latencies.push(latency);
          results.total_requests++;

          if (response.ok) {
            results.successful++;
          } else {
            results.failed++;
          }

          if (i % 50 === 0) {
            console.log(
              `  ${endpoint.name}: ${i}/${endpoint.concurrency} requests`
            );
          }
        } catch (error) {
          results.failed++;
          results.total_requests++;
        }
      })();

      promises.push(promise);
    }
  }

  await Promise.allSettled(promises);

  const total_time = Date.now() - results.start_time;
  const sorted_latencies = results.latencies.sort((a, b) => a - b);

  console.log("\n📊 LOAD TEST RESULTS");
  console.log("═".repeat(80));
  console.log("");
  console.log(`Total Requests:     ${results.total_requests}`);
  console.log(`Successful:         ${results.successful} (${((results.successful / results.total_requests) * 100).toFixed(1)}%)`);
  console.log(`Failed:             ${results.failed}`);
  console.log(`Total Time:         ${total_time}ms`);
  console.log(`Throughput:         ${(results.total_requests / (total_time / 1000)).toFixed(0)} req/sec`);
  console.log("");

  console.log("⏱️  LATENCY STATS");
  console.log("─".repeat(80));
  console.log(`Min:                ${sorted_latencies[0]}ms`);
  console.log(
    `P50:                ${sorted_latencies[Math.floor(sorted_latencies.length * 0.5)]}ms`
  );
  console.log(
    `P95:                ${sorted_latencies[Math.floor(sorted_latencies.length * 0.95)]}ms`
  );
  console.log(
    `P99:                ${sorted_latencies[Math.floor(sorted_latencies.length * 0.99)]}ms`
  );
  console.log(`Max:                ${sorted_latencies[sorted_latencies.length - 1]}ms`);
  console.log("");

  const passed =
    results.successful >= results.total_requests * 0.95 &&
    sorted_latencies[Math.floor(sorted_latencies.length * 0.99)] < 5000;

  console.log("✅ PRODUCTION READINESS CHECK");
  console.log("─".repeat(80));
  console.log(
    `95%+ Success Rate:  ${results.successful >= results.total_requests * 0.95 ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(
    `P99 < 5s:           ${sorted_latencies[Math.floor(sorted_latencies.length * 0.99)] < 5000 ? "✅ PASS" : "❌ FAIL"}`
  );
  console.log(
    `Status:             ${passed ? "🟢 PRODUCTION READY" : "🟡 NEEDS OPTIMIZATION"}`
  );
  console.log("");

  return { results, passed };
}

// Run test
loadTest()
  .then(({ passed }) => {
    console.log("═".repeat(80));
    console.log(passed ? "✅ LOAD TEST PASSED" : "⚠️  LOAD TEST NEEDS REVIEW");
    process.exit(passed ? 0 : 1);
  })
  .catch((error) => {
    console.error("Load test failed:", error);
    process.exit(1);
  });
