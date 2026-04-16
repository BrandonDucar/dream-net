// Simple test to verify Express works
const express = require('express');
const app = express();
const PORT = 3210;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'treasury', timestamp: Date.now() });
});

app.get('/api/treasury/status', (req, res) => {
  res.json({
    balance: 1000,
    dailyUsage: 150,
    pendingCount: 0,
    agent: 'treasury',
  });
});

app.listen(PORT, () => {
  console.log(`✓ Treasury Service (test) listening on port ${PORT}`);
  console.log(`  → http://localhost:${PORT}/health`);
  console.log(`  → http://localhost:${PORT}/api/treasury/status`);
});
