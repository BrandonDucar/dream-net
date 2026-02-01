import { Router } from 'express';
import { googleAdsCloneService } from '../services/GoogleAdsCloneService';
import { insertCampaignSchema, insertAdGroupSchema, insertKeywordSchema, insertAdSchema } from '@dreamnet/shared/adsSchema';
import { z } from 'zod';

const router = Router();

// Campaign Routes
router.post('/campaigns', async (req, res) => {
  try {
    const validatedData = insertCampaignSchema.parse(req.body);
    const campaign = await googleAdsCloneService.createCampaign(validatedData);
    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await googleAdsCloneService.getCampaigns();
    res.json({ success: true, data: campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/campaigns/:id', async (req, res) => {
  try {
    const campaign = await googleAdsCloneService.getCampaign(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' });
    }
    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/campaigns/:id', async (req, res) => {
  try {
    const updates = insertCampaignSchema.partial().parse(req.body);
    const campaign = await googleAdsCloneService.updateCampaign(req.params.id, updates);
    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/campaigns/:id', async (req, res) => {
  try {
    const deleted = await googleAdsCloneService.deleteCampaign(req.params.id);
    res.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ad Group Routes
router.post('/ad-groups', async (req, res) => {
  try {
    const validatedData = insertAdGroupSchema.parse(req.body);
    const adGroup = await googleAdsCloneService.createAdGroup(validatedData);
    res.json({ success: true, data: adGroup });
  } catch (error) {
    console.error('Error creating ad group:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/ad-groups', async (req, res) => {
  try {
    const campaignId = req.query.campaignId as string;
    const adGroups = await googleAdsCloneService.getAdGroups(campaignId);
    res.json({ success: true, data: adGroups });
  } catch (error) {
    console.error('Error fetching ad groups:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/ad-groups/:id', async (req, res) => {
  try {
    const updates = insertAdGroupSchema.partial().parse(req.body);
    const adGroup = await googleAdsCloneService.updateAdGroup(req.params.id, updates);
    res.json({ success: true, data: adGroup });
  } catch (error) {
    console.error('Error updating ad group:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Keyword Routes
router.post('/keywords', async (req, res) => {
  try {
    const validatedData = insertKeywordSchema.parse(req.body);
    const keyword = await googleAdsCloneService.createKeyword(validatedData);
    res.json({ success: true, data: keyword });
  } catch (error) {
    console.error('Error creating keyword:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/keywords', async (req, res) => {
  try {
    const adGroupId = req.query.adGroupId as string;
    const keywords = await googleAdsCloneService.getKeywords(adGroupId);
    res.json({ success: true, data: keywords });
  } catch (error) {
    console.error('Error fetching keywords:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/keywords/:id', async (req, res) => {
  try {
    const updates = insertKeywordSchema.partial().parse(req.body);
    const keyword = await googleAdsCloneService.updateKeyword(req.params.id, updates);
    res.json({ success: true, data: keyword });
  } catch (error) {
    console.error('Error updating keyword:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete('/keywords/:id', async (req, res) => {
  try {
    const deleted = await googleAdsCloneService.deleteKeyword(req.params.id);
    res.json({ success: true, deleted });
  } catch (error) {
    console.error('Error deleting keyword:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ad Routes
router.post('/ads', async (req, res) => {
  try {
    const validatedData = insertAdSchema.parse(req.body);
    const ad = await googleAdsCloneService.createAd(validatedData);
    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get('/ads', async (req, res) => {
  try {
    const adGroupId = req.query.adGroupId as string;
    const ads = await googleAdsCloneService.getAds(adGroupId);
    res.json({ success: true, data: ads });
  } catch (error) {
    console.error('Error fetching ads:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/ads/:id', async (req, res) => {
  try {
    const updates = insertAdSchema.partial().parse(req.body);
    const ad = await googleAdsCloneService.updateAd(req.params.id, updates);
    res.json({ success: true, data: ad });
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Analytics & Performance Routes
router.get('/campaigns/:id/performance', async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const performance = await googleAdsCloneService.getCampaignPerformance(campaignId, start, end);
    res.json({ success: true, data: performance });
  } catch (error) {
    console.error('Error fetching campaign performance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/ad-groups/:id/performance', async (req, res) => {
  try {
    const adGroupId = req.params.id;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const performance = await googleAdsCloneService.getAdGroupPerformance(adGroupId, start, end);
    res.json({ success: true, data: performance });
  } catch (error) {
    console.error('Error fetching ad group performance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/keywords/:id/performance', async (req, res) => {
  try {
    const keywordId = req.params.id;
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;
    
    const performance = await googleAdsCloneService.getKeywordPerformance(keywordId, start, end);
    res.json({ success: true, data: performance });
  } catch (error) {
    console.error('Error fetching keyword performance:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Dashboard & Overview Routes
router.get('/dashboard/summary', async (req, res) => {
  try {
    const summary = await googleAdsCloneService.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Keyword Research Routes
router.get('/keywords/suggestions', async (req, res) => {
  try {
    const { seed, matchType } = req.query;
    if (!seed) {
      return res.status(400).json({ success: false, error: 'Seed keyword is required' });
    }
    
    const suggestions = await googleAdsCloneService.generateKeywordSuggestions(
      seed as string, 
      matchType as string
    );
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Error generating keyword suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Sample Data Generation (for demo purposes)
router.post('/campaigns/:id/generate-sample-metrics', async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { days } = req.body;
    
    await googleAdsCloneService.generateSampleMetrics(campaignId, days || 30);
    res.json({ success: true, message: 'Sample metrics generated successfully' });
  } catch (error) {
    console.error('Error generating sample metrics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Bid Management Routes
router.put('/campaigns/:id/bid-strategy', async (req, res) => {
  try {
    const campaignId = req.params.id;
    const { strategy, targetCPA } = req.body;
    
    const campaign = await googleAdsCloneService.updateBidStrategy(campaignId, strategy, targetCPA);
    res.json({ success: true, data: campaign });
  } catch (error) {
    console.error('Error updating bid strategy:', error);
    res.status(400).json({ success: false, error: error.message });
  }
});

// Bulk Operations Routes
router.put('/keywords/bulk/bids', async (req, res) => {
  try {
    const { keywordIds, bidAmount } = req.body;
    
    if (!keywordIds || !Array.isArray(keywordIds) || keywordIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Keyword IDs array is required' });
    }
    
    if (!bidAmount || typeof bidAmount !== 'number') {
      return res.status(400).json({ success: false, error: 'Valid bid amount is required' });
    }
    
    const result = await googleAdsCloneService.bulkUpdateKeywordBids(keywordIds, bidAmount);
    res.json({ success: result, message: result ? 'Keywords updated successfully' : 'Failed to update keywords' });
  } catch (error) {
    console.error('Error bulk updating keyword bids:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/campaigns/bulk/pause', async (req, res) => {
  try {
    const { campaignIds } = req.body;
    
    if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
      return res.status(400).json({ success: false, error: 'Campaign IDs array is required' });
    }
    
    const result = await googleAdsCloneService.pauseCampaigns(campaignIds);
    res.json({ success: result, message: result ? 'Campaigns paused successfully' : 'Failed to pause campaigns' });
  } catch (error) {
    console.error('Error bulk pausing campaigns:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Ad Quality & Optimization Routes
router.get('/ads/:id/suggestions', async (req, res) => {
  try {
    const adId = req.params.id;
    const suggestions = await googleAdsCloneService.getAdStrengthSuggestions(adId);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('Error fetching ad suggestions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GEOFENCING ROUTES
  
// Get geofence locations for a campaign
router.get('/campaigns/:campaignId/geofences', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const locations = await googleAdsCloneService.getGeofenceLocations(campaignId);
    res.json({ success: true, locations });
  } catch (error) {
    console.error('Error fetching geofence locations:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch geofence locations' });
  }
});

// Create competitor geofence
router.post('/campaigns/:campaignId/geofences/competitor', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { competitorName, address, radius = 0.5, bidModifier = 1.2 } = req.body;
    
    if (!competitorName || !address) {
      return res.status(400).json({ success: false, error: 'Competitor name and address are required' });
    }

    const geofence = await googleAdsCloneService.createCompetitorGeofence(
      campaignId, competitorName, address, radius, bidModifier
    );
    
    res.json({ 
      success: true, 
      geofence,
      message: `Competitor geofence created for ${competitorName}` 
    });
  } catch (error) {
    console.error('Error creating competitor geofence:', error);
    res.status(500).json({ success: false, error: 'Failed to create competitor geofence' });
  }
});

// Create radius geofence
router.post('/campaigns/:campaignId/geofences/radius', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { centerAddress, radius, bidModifier = 1.0 } = req.body;
    
    if (!centerAddress || !radius) {
      return res.status(400).json({ success: false, error: 'Center address and radius are required' });
    }

    const geofence = await googleAdsCloneService.createRadiusGeofence(
      campaignId, centerAddress, radius, bidModifier
    );
    
    res.json({ 
      success: true, 
      geofence,
      message: `Radius geofence created: ${radius} miles from ${centerAddress}` 
    });
  } catch (error) {
    console.error('Error creating radius geofence:', error);
    res.status(500).json({ success: false, error: 'Failed to create radius geofence' });
  }
});

// Create event geofence
router.post('/campaigns/:campaignId/geofences/event', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { eventName, eventVenue, eventDate, radius = 1.0, bidModifier = 1.5 } = req.body;
    
    if (!eventName || !eventVenue || !eventDate) {
      return res.status(400).json({ success: false, error: 'Event name, venue, and date are required' });
    }

    const geofence = await googleAdsCloneService.createEventGeofence(
      campaignId, eventName, eventVenue, new Date(eventDate), radius, bidModifier
    );
    
    res.json({ 
      success: true, 
      geofence,
      message: `Event geofence created for ${eventName}` 
    });
  } catch (error) {
    console.error('Error creating event geofence:', error);
    res.status(500).json({ success: false, error: 'Failed to create event geofence' });
  }
});

// Get location performance analytics
router.get('/campaigns/:campaignId/location-performance', async (req, res) => {
  try {
    const { campaignId } = req.params;
    const { days = 30 } = req.query;
    
    const performance = await googleAdsCloneService.getLocationPerformance(campaignId, Number(days));
    res.json({ success: true, performance });
  } catch (error) {
    console.error('Error fetching location performance:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch location performance' });
  }
});

// Generate location-based keywords
router.post('/keywords/location-suggestions', async (req, res) => {
  try {
    const { businessType, targetLocation } = req.body;
    
    if (!businessType || !targetLocation) {
      return res.status(400).json({ success: false, error: 'Business type and target location are required' });
    }

    const keywords = await googleAdsCloneService.generateLocationKeywords(businessType, targetLocation);
    res.json({ success: true, keywords });
  } catch (error) {
    console.error('Error generating location keywords:', error);
    res.status(500).json({ success: false, error: 'Failed to generate location keywords' });
  }
});

// GOOGLE PARTNER PROGRAM ROUTES

// Get current Google Partner status
router.get('/partner-program/status', async (req, res) => {
  try {
    const status = await googleAdsCloneService.getPartnerStatus();
    const progress = await googleAdsCloneService.calculatePartnerProgress();
    
    res.json({ 
      success: true, 
      partnerStatus: status,
      progress 
    });
  } catch (error) {
    console.error('Error fetching partner status:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch partner status' });
  }
});

// Update partner program information
router.put('/partner-program/update', async (req, res) => {
  try {
    const updates = req.body;
    const updatedProgram = await googleAdsCloneService.updatePartnerProgram(updates);
    
    res.json({ 
      success: true, 
      partnerProgram: updatedProgram,
      message: 'Partner program information updated successfully' 
    });
  } catch (error) {
    console.error('Error updating partner program:', error);
    res.status(500).json({ success: false, error: 'Failed to update partner program' });
  }
});

// Add certification
router.post('/partner-program/certifications', async (req, res) => {
  try {
    const { certificationName, achievedDate } = req.body;
    
    if (!certificationName) {
      return res.status(400).json({ success: false, error: 'Certification name is required' });
    }

    await googleAdsCloneService.addCertification(
      certificationName, 
      achievedDate ? new Date(achievedDate) : new Date()
    );
    
    res.json({ 
      success: true, 
      message: `Certification added: ${certificationName}` 
    });
  } catch (error) {
    console.error('Error adding certification:', error);
    res.status(500).json({ success: false, error: 'Failed to add certification' });
  }
});

// Get partner progress and next steps
router.get('/partner-program/progress', async (req, res) => {
  try {
    const progress = await googleAdsCloneService.calculatePartnerProgress();
    res.json({ success: true, progress });
  } catch (error) {
    console.error('Error calculating partner progress:', error);
    res.status(500).json({ success: false, error: 'Failed to calculate partner progress' });
  }
});

export { router as googleAdsRoutes };