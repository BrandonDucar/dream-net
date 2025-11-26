/**
 * Competitive Intelligence API Routes
 * Endpoints for company research, analysis, opportunity finding, and roadmap generation
 */

import { Router } from "express";
import { CompetitiveIntelligenceCore } from "@dreamnet/competitive-intelligence-core";
import type { Company, Opportunity } from "@dreamnet/competitive-intelligence-core";

const router = Router();

/**
 * GET /api/competitive-intelligence/companies
 * Get all companies
 */
router.get("/companies", (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const companies = core.getAllCompanies();
    res.json({
      success: true,
      companies,
      count: companies.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get companies",
      message: error.message,
    });
  }
});

/**
 * GET /api/competitive-intelligence/companies/:id
 * Get a specific company
 */
router.get("/companies/:id", (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const company = core.getCompany(req.params.id);
    if (!company) {
      return res.status(404).json({
        error: "Company not found",
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get company",
      message: error.message,
    });
  }
});

/**
 * POST /api/competitive-intelligence/companies
 * Add a new company for research
 */
router.post("/companies", async (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const company: Company = {
      id: req.body.id || `company-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      name: req.body.name,
      vertical: req.body.vertical,
      website: req.body.website,
      description: req.body.description || "",
      founded: req.body.founded,
      headquarters: req.body.headquarters,
      employees: req.body.employees,
      revenue: req.body.revenue,
      marketCap: req.body.marketCap,
      status: "active",
      lastUpdated: Date.now(),
    };

    core.addCompany(company);

    res.json({
      success: true,
      company,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to add company",
      message: error.message,
    });
  }
});

/**
 * POST /api/competitive-intelligence/companies/:id/research
 * Research a company
 */
router.post("/companies/:id/research", async (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const researchData = await core.researchCompany(req.params.id);

    res.json({
      success: true,
      researchData,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to research company",
      message: error.message,
    });
  }
});

/**
 * POST /api/competitive-intelligence/companies/:id/analyze
 * Analyze a company
 */
router.post("/companies/:id/analyze", async (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const analysis = await core.analyzeCompany(req.params.id);

    res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to analyze company",
      message: error.message,
    });
  }
});

/**
 * GET /api/competitive-intelligence/opportunities/:vertical
 * Find opportunities in a vertical
 */
router.get("/opportunities/:vertical", async (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const opportunities = await core.findOpportunities(req.params.vertical);

    res.json({
      success: true,
      vertical: req.params.vertical,
      opportunities,
      count: opportunities.length,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to find opportunities",
      message: error.message,
    });
  }
});

/**
 * GET /api/competitive-intelligence/roadmap/:vertical
 * Generate innovation roadmap for a vertical
 */
router.get("/roadmap/:vertical", async (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const roadmap = await core.generateRoadmap(req.params.vertical);

    res.json({
      success: true,
      vertical: req.params.vertical,
      roadmap,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to generate roadmap",
      message: error.message,
    });
  }
});

/**
 * GET /api/competitive-intelligence/verticals
 * Get all verticals with company counts
 */
router.get("/verticals", (req, res) => {
  try {
    const core = (global as any).competitiveIntelligenceCore as CompetitiveIntelligenceCore;
    if (!core) {
      return res.status(503).json({
        error: "Competitive Intelligence Core not initialized",
      });
    }

    const companies = core.getAllCompanies();
    const verticals = new Map<string, number>();

    for (const company of companies) {
      verticals.set(company.vertical, (verticals.get(company.vertical) || 0) + 1);
    }

    const verticalList = Array.from(verticals.entries()).map(([vertical, count]) => ({
      vertical,
      companyCount: count,
    }));

    res.json({
      success: true,
      verticals: verticalList,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "Failed to get verticals",
      message: error.message,
    });
  }
});

export default router;

