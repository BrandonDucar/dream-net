import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 7010;

// Serve static files from the current directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`
  🧠 [DreamNet Brain] Visualization Server Live!
  👉 View the Brain: http://localhost:${PORT}
  
  Guilds Connected: CDC, Ghost, ResearchHub
  Telemetry: Active
  `);
});
