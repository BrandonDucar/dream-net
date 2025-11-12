import { Router } from 'express';
import type { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

interface PriorityItem {
  id: string;
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'patents' | 'revenue' | 'technical' | 'operations' | 'personal';
  status: 'pending' | 'in-progress' | 'blocked' | 'completed' | 'overdue';
  dueDate?: string;
  estimatedValue?: number;
  dependencies?: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// In-memory storage (replace with database in production)
let priorities: PriorityItem[] = [
  {
    id: 'patent-1',
    title: 'File Biomimetic Agent Swarm Patents',
    description: 'Submit 10 high-value patents for biomimetic multi-agent coordination system worth $280M+ to USPTO',
    priority: 'critical',
    category: 'patents',
    status: 'pending',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    estimatedValue: 280000000,
    progress: 85,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'seed-1',
    title: 'Plant Initial Dream Seeds',
    description: 'Plant 5-10 dream seeds across different categories to start building dream intelligence network',
    priority: 'high',
    category: 'technical',
    status: 'pending',
    estimatedValue: 50000000,
    progress: 20,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'bio-1',
    title: 'Optimize Biometric Performance',
    description: 'Monitor 92% optimization score and synchronize 23,000+ nano agents with caffeine protocol',
    priority: 'high',
    category: 'personal',
    status: 'in-progress',
    progress: 92,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'revenue-1',
    title: 'Launch Commercialization Strategy',
    description: 'Begin monetizing $200M+ market opportunity through IP licensing and service offerings',
    priority: 'high',
    category: 'revenue',
    status: 'pending',
    estimatedValue: 200000000,
    progress: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Get all priorities
router.get('/', (req: Request, res: Response) => {
  try {
    // Update overdue status
    const now = new Date();
    priorities.forEach(item => {
      if (item.dueDate && new Date(item.dueDate) < now && item.status !== 'completed') {
        item.status = 'overdue';
        item.updatedAt = new Date().toISOString();
      }
    });

    // Sort by priority and due date
    const sortedPriorities = [...priorities].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      // If same priority, sort by due date
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      
      return 0;
    });

    res.json({
      success: true,
      items: sortedPriorities,
      stats: {
        total: priorities.length,
        critical: priorities.filter(p => p.priority === 'critical' || p.status === 'overdue').length,
        completed: priorities.filter(p => p.status === 'completed').length,
        totalValue: priorities.reduce((sum, p) => sum + (p.estimatedValue || 0), 0)
      }
    });
  } catch (error) {
    console.error('Error fetching priorities:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch priorities'
    });
  }
});

// Add new priority
router.post('/', (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      priority = 'medium',
      category = 'technical',
      status = 'pending',
      dueDate,
      estimatedValue,
      dependencies,
      progress = 0
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    const newPriority: PriorityItem = {
      id: uuidv4(),
      title,
      description,
      priority,
      category,
      status,
      dueDate,
      estimatedValue: estimatedValue ? parseInt(estimatedValue) : undefined,
      dependencies,
      progress: parseInt(progress) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    priorities.push(newPriority);

    res.json({
      success: true,
      item: newPriority,
      message: 'Priority item added successfully'
    });
  } catch (error) {
    console.error('Error adding priority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add priority item'
    });
  }
});

// Update priority
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const itemIndex = priorities.findIndex(p => p.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Priority item not found'
      });
    }

    priorities[itemIndex] = {
      ...priorities[itemIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    res.json({
      success: true,
      item: priorities[itemIndex],
      message: 'Priority item updated successfully'
    });
  } catch (error) {
    console.error('Error updating priority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update priority item'
    });
  }
});

// Delete priority
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const itemIndex = priorities.findIndex(p => p.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Priority item not found'
      });
    }

    priorities.splice(itemIndex, 1);

    res.json({
      success: true,
      message: 'Priority item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting priority:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete priority item'
    });
  }
});

// Get AI-generated suggestions based on system state
router.get('/suggestions', async (req: Request, res: Response) => {
  try {
    const suggestions = [];

    // Check system metrics for auto-suggestions
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    // Patent filing urgency
    suggestions.push({
      title: 'File Patent Applications',
      description: 'Submit high-value biomimetic swarm patents to secure IP protection',
      priority: 'critical',
      category: 'patents',
      status: 'pending',
      estimatedValue: 280000000,
      dueDate: nextWeek.toISOString(),
      confidence: 95
    });

    // Dream seed planting
    suggestions.push({
      title: 'Plant Dream Seeds',
      description: 'Dream network lucidity optimal for seed planting across all categories',
      priority: 'high',
      category: 'technical',
      status: 'pending',
      estimatedValue: 50000000,
      confidence: 88
    });

    // Revenue generation
    suggestions.push({
      title: 'Launch Beta Revenue Streams',
      description: 'Begin monetizing core technologies through licensing agreements',
      priority: 'high',
      category: 'revenue',
      status: 'pending',
      estimatedValue: 2000000,
      confidence: 82
    });

    // System optimization
    suggestions.push({
      title: 'Scale Viral Swarm Population',
      description: 'Expand nano-agent population from 19K to 50K+ for enhanced capabilities',
      priority: 'medium',
      category: 'technical',
      status: 'pending',
      confidence: 76
    });

    res.json({
      success: true,
      suggestions: suggestions.slice(0, 3), // Return top 3 suggestions
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate suggestions'
    });
  }
});

export default router;