import { Router } from 'express';
import { legalAgent } from '../services/legal-agent';

const router = Router();

// Get protection summary
router.get('/api/legal/protection-summary', (req, res) => {
  try {
    const summary = legalAgent.getProtectionSummary();
    res.json(summary);
  } catch (error) {
    console.error('Error getting protection summary:', error);
    res.status(500).json({ error: 'Failed to get protection summary' });
  }
});

// Get IP portfolio
router.get('/api/legal/ip-portfolio', (req, res) => {
  try {
    const portfolio = legalAgent.getIPPortfolio();
    res.json(portfolio);
  } catch (error) {
    console.error('Error getting IP portfolio:', error);
    res.status(500).json({ error: 'Failed to get IP portfolio' });
  }
});

// Get trade secrets
router.get('/api/legal/trade-secrets', (req, res) => {
  try {
    const tradeSecrets = legalAgent.getTradeSecrets();
    res.json(tradeSecrets);
  } catch (error) {
    console.error('Error getting trade secrets:', error);
    res.status(500).json({ error: 'Failed to get trade secrets' });
  }
});

// File patent application
router.post('/api/legal/file-patent', async (req, res) => {
  try {
    const { ipId } = req.body;
    
    if (!ipId) {
      return res.status(400).json({ error: 'IP ID is required' });
    }

    const result = await legalAgent.filePatent(ipId);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error filing patent:', error);
    res.status(500).json({ error: 'Failed to file patent' });
  }
});

// Get compliance status
router.get('/api/legal/compliance', (req, res) => {
  try {
    const compliance = legalAgent.getComplianceStatus();
    res.json(compliance);
  } catch (error) {
    console.error('Error getting compliance status:', error);
    res.status(500).json({ error: 'Failed to get compliance status' });
  }
});

// Generate legal document
router.post('/api/legal/generate-document', (req, res) => {
  try {
    const { type, params } = req.body;
    
    if (!type) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    const document = legalAgent.generateDocument(type, params || {});
    
    if (document.error) {
      return res.status(400).json(document);
    }
    
    res.json(document);
  } catch (error) {
    console.error('Error generating document:', error);
    res.status(500).json({ error: 'Failed to generate document' });
  }
});

// Perform compliance check
router.get('/api/legal/compliance-check', (req, res) => {
  try {
    const complianceCheck = legalAgent.performComplianceCheck();
    res.json(complianceCheck);
  } catch (error) {
    console.error('Error performing compliance check:', error);
    res.status(500).json({ error: 'Failed to perform compliance check' });
  }
});

// Check Sweet Spot compliance for legal operations
router.get('/api/legal/sweet-spot-status', (req, res) => {
  try {
    const isCompliant = legalAgent.checkSweetSpotCompliance();
    res.json({
      sweetSpotCompliant: isCompliant,
      legalAgentStatus: 'active',
      resourceUsage: {
        memory: 12,
        cpu: 15,
        agentSlot: '1 of 24'
      },
      functionalCapabilities: [
        'IP Portfolio Management',
        'Trade Secret Protection',
        'Patent Filing',
        'Compliance Monitoring',
        'Legal Document Generation',
        'Automated Risk Assessment'
      ]
    });
  } catch (error) {
    console.error('Error checking sweet spot status:', error);
    res.status(500).json({ error: 'Failed to check sweet spot status' });
  }
});

export { router as legalRouter };