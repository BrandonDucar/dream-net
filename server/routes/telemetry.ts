/**
 * DreamScope Telemetry Tiles - Minimal essential monitoring data
 * Copy/paste ready for immediate dashboard integration
 */

import { Router } from 'express';
import fs from 'fs';
import { spawn } from 'child_process';

const router: Router = Router();

// Kill switch is optional
let isHardStop: any = null;
try {
  const killSwitchModule = require('../core/killSwitch.js');
  isHardStop = killSwitchModule.isHardStop;
} catch {
  console.warn("[Telemetry Router] Kill switch not available");
  isHardStop = () => false; // Fallback
}

// Core telemetry data structure
interface TelemetryTile {
  id: string;
  title: string;
  value: string | number;
  unit?: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  trend?: 'up' | 'down' | 'stable';
  lastUpdate: string;
}

class TelemetryCollector {
  private async getSystemStats() {
    return new Promise<{ cpu: number; memory: number; uptime: number }>((resolve) => {
      // Get basic system stats
      const memInfo = process.memoryUsage();
      const uptime = process.uptime();
      
      // Simple CPU estimation based on load
      const loadAvg = require('os').loadavg()[0]; // 1-minute load average
      const cpuCount = require('os').cpus().length;
      const cpuPercent = Math.min(100, (loadAvg / cpuCount) * 100);
      
      resolve({
        cpu: Math.round(cpuPercent),
        memory: Math.round(memInfo.rss / 1024 / 1024), // MB
        uptime: Math.round(uptime)
      });
    });
  }

  private async getDatabaseHealth() {
    try {
      const { db } = await import('../db.js');
      const start = Date.now();
      await db.execute('SELECT 1');
      const responseTime = Date.now() - start;
      
      return {
        status: responseTime < 100 ? 'healthy' : responseTime < 500 ? 'warning' : 'critical',
        responseTime,
        connected: true
      };
    } catch (error) {
      return {
        status: 'critical' as const,
        responseTime: 0,
        connected: false
      };
    }
  }

  private async getAgentStatus() {
    try {
      // Count running processes that look like agents
      const ps = spawn('ps', ['aux']);
      let output = '';
      
      return new Promise<{ active: number; total: number }>((resolve) => {
        ps.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        ps.on('close', () => {
          const lines = output.split('\n');
          const nodeProcesses = lines.filter(line => 
            line.includes('node') && 
            (line.includes('agent') || line.includes('Agent') || line.includes('tsx'))
          );
          
          resolve({
            active: Math.max(1, nodeProcesses.length - 1), // Subtract main process
            total: 24 // Known total from logs
          });
        });
        
        ps.on('error', () => {
          resolve({ active: 1, total: 24 });
        });
      });
    } catch (error) {
      return { active: 1, total: 24 };
    }
  }

  private getBudgetStatus() {
    const hardStop = isHardStop();
    const memoryMB = Math.round(process.memoryUsage().rss / 1024 / 1024);
    
    return {
      hardStop,
      memoryMB,
      status: hardStop ? 'critical' : memoryMB > 500 ? 'warning' : 'healthy',
      flagFileExists: fs.existsSync('/tmp/DREAMOPS_STOP.flag'),
      environmentStop: process.env.BUDGET_HARD_STOP === '1'
    };
  }

  public async collectTiles(): Promise<TelemetryTile[]> {
    const timestamp = new Date().toISOString();
    
    // Collect all data in parallel
    const [systemStats, dbHealth, agentStatus, budgetStatus] = await Promise.all([
      this.getSystemStats(),
      this.getDatabaseHealth(),
      this.getAgentStatus(),
      Promise.resolve(this.getBudgetStatus())
    ]);

    const tiles: TelemetryTile[] = [
      // System Health
      {
        id: 'system_memory',
        title: 'Memory Usage',
        value: systemStats.memory,
        unit: 'MB',
        status: systemStats.memory > 800 ? 'critical' : systemStats.memory > 500 ? 'warning' : 'healthy',
        trend: 'stable',
        lastUpdate: timestamp
      },
      
      {
        id: 'system_cpu',
        title: 'CPU Load',
        value: systemStats.cpu,
        unit: '%',
        status: systemStats.cpu > 80 ? 'critical' : systemStats.cpu > 60 ? 'warning' : 'healthy',
        trend: 'stable',
        lastUpdate: timestamp
      },

      {
        id: 'system_uptime',
        title: 'Uptime',
        value: Math.floor(systemStats.uptime / 60),
        unit: 'min',
        status: systemStats.uptime > 300 ? 'healthy' : 'warning',
        trend: 'up',
        lastUpdate: timestamp
      },

      // Database Health
      {
        id: 'db_health',
        title: 'Database',
        value: dbHealth.connected ? 'ONLINE' : 'OFFLINE',
        status: dbHealth.status as 'warning' | 'healthy' | 'critical' | 'offline',
        lastUpdate: timestamp
      },

      {
        id: 'db_response',
        title: 'DB Response',
        value: dbHealth.responseTime,
        unit: 'ms',
        status: dbHealth.status as 'warning' | 'healthy' | 'critical' | 'offline',
        trend: 'stable',
        lastUpdate: timestamp
      },

      // Agent Ecosystem
      {
        id: 'agents_active',
        title: 'Active Agents',
        value: `${agentStatus.active}/${agentStatus.total}`,
        status: agentStatus.active > 15 ? 'healthy' : agentStatus.active > 5 ? 'warning' : 'critical',
        trend: budgetStatus.hardStop ? 'down' : 'stable',
        lastUpdate: timestamp
      },

      // Budget Controls
      {
        id: 'budget_status',
        title: 'Budget Control',
        value: budgetStatus.hardStop ? 'ACTIVE' : 'NORMAL',
        status: budgetStatus.status as 'warning' | 'healthy' | 'critical' | 'offline',
        lastUpdate: timestamp
      },

      {
        id: 'memory_safeguard',
        title: 'Memory Guard',
        value: budgetStatus.memoryMB,
        unit: 'MB',
        status: budgetStatus.memoryMB > 800 ? 'critical' : 'healthy',
        trend: 'stable',
        lastUpdate: timestamp
      },

      // System Flags
      {
        id: 'hard_stop',
        title: 'Emergency Stop',
        value: budgetStatus.hardStop ? 'ENGAGED' : 'READY',
        status: budgetStatus.hardStop ? 'warning' : 'healthy',
        lastUpdate: timestamp
      },

      // Development Status
      {
        id: 'environment',
        title: 'Environment',
        value: process.env.NODE_ENV || 'development',
        status: 'healthy',
        lastUpdate: timestamp
      }
    ];

    return tiles;
  }
}

const telemetryCollector = new TelemetryCollector();

// Main telemetry endpoint - returns all tiles
router.get('/api/telemetry/tiles', async (req, res) => {
  try {
    const tiles = await telemetryCollector.collectTiles();
    
    res.json({
      success: true,
      tiles,
      meta: {
        collected_at: new Date().toISOString(),
        tile_count: tiles.length,
        healthy_count: tiles.filter(t => t.status === 'healthy').length,
        warning_count: tiles.filter(t => t.status === 'warning').length,
        critical_count: tiles.filter(t => t.status === 'critical').length
      }
    });
  } catch (error) {
    console.error('📊 [TELEMETRY] Collection error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Individual tile endpoint
router.get('/api/telemetry/tile/:id', async (req, res) => {
  try {
    const tiles = await telemetryCollector.collectTiles();
    const tile = tiles.find(t => t.id === req.params.id);
    
    if (!tile) {
      return res.status(404).json({
        success: false,
        error: 'Tile not found'
      });
    }
    
    res.json({
      success: true,
      tile
    });
  } catch (error) {
    console.error('📊 [TELEMETRY] Tile error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Health summary endpoint
router.get('/api/telemetry/health', async (req, res) => {
  try {
    const tiles = await telemetryCollector.collectTiles();
    
    const summary = {
      overall_status: tiles.some(t => t.status === 'critical') ? 'critical' :
                     tiles.some(t => t.status === 'warning') ? 'warning' : 'healthy',
      total_tiles: tiles.length,
      healthy: tiles.filter(t => t.status === 'healthy').length,
      warning: tiles.filter(t => t.status === 'warning').length,
      critical: tiles.filter(t => t.status === 'critical').length,
      offline: tiles.filter(t => t.status === 'offline').length,
      last_check: new Date().toISOString()
    };
    
    res.json({
      success: true,
      health: summary
    });
  } catch (error) {
    console.error('📊 [TELEMETRY] Health summary error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;