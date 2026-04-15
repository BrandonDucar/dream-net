import { Express } from 'express';
import { dataIntelligenceService } from '../services/DataIntelligenceService';

export function registerDataIntelligenceRoutes(app: Express) {
  // Get aggregated intelligence insights
  app.get('/api/intelligence/insights', async (req, res) => {
    try {
      const insights = await dataIntelligenceService.getAggregatedInsights();
      res.json({ success: true, insights });
    } catch (error: any) {
      console.error('Intelligence insights error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get Eric's specific profile
  app.get('/api/intelligence/eric-profile', async (req, res) => {
    try {
      const eric = await dataIntelligenceService.getEricProfile();
      res.json({ success: true, eric });
    } catch (error: any) {
      console.error('Eric profile error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Get business dashboard metrics
  app.get('/api/intelligence/dashboard', async (req, res) => {
    try {
      const dashboard = await dataIntelligenceService.getDashboardMetrics();
      res.json({ success: true, dashboard });
    } catch (error: any) {
      console.error('Dashboard metrics error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Track premium unlock events
  app.post('/api/intelligence/premium-unlock', async (req, res) => {
    try {
      const { keywords, amount, paymentMethod } = req.body;
      const userId = req.user?.id || req.ip || 'anonymous';
      
      await dataIntelligenceService.trackPremiumUnlock({
        userId,
        keywords,
        amount,
        paymentMethod,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip
      });
      
      res.json({ success: true, message: 'Premium unlock tracked' });
    } catch (error: any) {
      console.error('Premium unlock tracking error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Track competitor analysis events
  app.post('/api/intelligence/competitor-analysis', async (req, res) => {
    try {
      const { competitorUrl, analysisType, keywords, insights } = req.body;
      const userId = req.user?.id || req.ip || 'anonymous';
      
      await dataIntelligenceService.trackCompetitorAnalysis({
        userId,
        competitorUrl,
        analysisType,
        keywords,
        insights,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip
      });
      
      res.json({ success: true, message: 'Competitor analysis tracked' });
    } catch (error: any) {
      console.error('Competitor analysis tracking error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // Track user behavior patterns
  app.post('/api/intelligence/user-behavior', async (req, res) => {
    try {
      const { action, context, metadata } = req.body;
      const userId = req.user?.id || req.ip || 'anonymous';
      
      await dataIntelligenceService.trackUserBehavior({
        userId,
        action,
        context,
        metadata,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent'] || '',
        ip: req.ip
      });
      
      res.json({ success: true, message: 'User behavior tracked' });
    } catch (error: any) {
      console.error('User behavior tracking error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  });

  console.log('📊 [Data Intelligence] Routes registered successfully');
}