import express from 'express';
import cors from 'cors';
import pheromoneRoutes from './routes/pheromone';
import taskRoutes from './routes/tasks'; // Renamed from tasksRoutes
import nodesRoutes from './routes/nodes';
import credentialsRoutes from './routes/credentials';
import marketplaceRoutes from './routes/marketplace'; // New import
import userRoutes from './routes/user';
import authMiddleware from './middleware/auth';
import { clawedetteService } from './services/ClawedetteService'; // Add Clawedette

const app = express();
const port = process.env.PORT || 3000; // Renamed from PORT to port

app.use(cors());
app.use(express.json());

// New routes
app.use('/api/antigravity/pheromone', pheromoneRoutes);
app.use('/api/antigravity/tasks', taskRoutes);
app.use('/api/antigravity/marketplace', marketplaceRoutes);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date() });
});

// Public routes
app.use('/api/user', userRoutes);

// Protected routes
app.use(authMiddleware);
app.use('/api/pheromone', pheromoneRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/nodes', nodesRoutes);
app.use('/api/credentials', credentialsRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`DreamNet API running on port ${PORT}`);

    // Initialize Clawedette 🦞✨
    try {
        await clawedetteService.startWatchdog();
        console.log('🦞 [Clawedette] Cognitive Core Pulse - Watchdog Active.');
    } catch (e) {
        console.error('🦞 [Clawedette] Watchdog Failure:', e);
    }
});
