import { Router } from 'express';
import { PropertiesManager } from '../services/PropertiesManager';

const router = Router();
let propertiesManager: PropertiesManager | null = null;

// Initialize Properties Manager
const getPropertiesManager = () => {
  if (!propertiesManager) {
    propertiesManager = new PropertiesManager();
  }
  return propertiesManager;
};

// Get all properties
router.get('/properties', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const properties = manager.getAllProperties();
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add new property
router.post('/properties', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const property = await manager.addProperty({
      ...req.body,
      tenants: [],
      maintenanceHistory: [],
      documents: [],
      energyEfficiency: {
        rating: 'B',
        score: 75,
        lastAssessment: new Date()
      },
      biomimeticSystems: [],
      features: req.body.features || ['standard-hvac', 'basic-security'],
      coordinates: { lat: 0, lng: 0 }
    });
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get property by ID
router.get('/properties/:id', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const property = manager.getProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update property
router.put('/properties/:id', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const property = await manager.updateProperty(req.params.id, req.body);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get team members
router.get('/properties/team', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const teamMembers = manager.getTeamMembers();
    res.json({ success: true, teamMembers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add team member
router.post('/properties/team', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const member = await manager.addTeamMember(req.body);
    res.json({ success: true, member });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get maintenance records
router.get('/properties/maintenance', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const properties = manager.getAllProperties();
    const allMaintenance = properties.flatMap(prop => 
      prop.maintenanceHistory.map(record => ({
        ...record,
        propertyId: prop.id,
        propertyAddress: prop.address
      }))
    );
    res.json({ success: true, maintenance: allMaintenance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Schedule maintenance
router.post('/properties/:id/maintenance', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const maintenance = await manager.scheduleMaintenance(req.params.id, req.body);
    res.json({ success: true, maintenance });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get portfolio analytics
router.get('/properties/analytics', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const properties = manager.getAllProperties();
    
    const analytics = {
      totalProperties: properties.length,
      totalValue: properties.reduce((sum, prop) => sum + prop.value, 0),
      totalRevenue: properties.reduce((sum, prop) => sum + prop.monthlyRevenue, 0),
      totalExpenses: properties.reduce((sum, prop) => sum + prop.expenses, 0),
      occupancyRate: properties.filter(p => p.status === 'occupied').length / properties.length * 100,
      propertyTypes: properties.reduce((acc, prop) => {
        acc[prop.type] = (acc[prop.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get system status
router.get('/properties/status', async (req, res) => {
  try {
    const manager = getPropertiesManager();
    const status = manager.getSystemStatus();
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;