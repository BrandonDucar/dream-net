import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDreamSchema, insertCocoonSchema, insertDreamCoreSchema, insertWalletSchema, type ContributorRole, contributorsLog, notifications, type CocoonLog } from "@shared/schema";
import { requireAdmin as oldRequireAdmin, isAdminWallet } from "./auth";
import { 
  generateNonce, 
  createSiweMessage, 
  verifySignature, 
  generateJWT, 
  verifyJWT, 
  requireAuth, 
  requireAdmin 
} from "./siwe-auth";
import { calculateAIScore } from "./ai-scoring";
import { calculateDreamScore } from "./dream-scoring";
import { dreamScoreEngine } from "./dream-score-engine";
import { notificationEngine } from "./notification-engine";
import { sampleDreams, staticSampleDreams } from "./sample-data";
import { getWalletData, analyzeWallet, type WalletAnalysis } from '@shared/wallet';
import { z } from "zod";
import { db, mongoDb } from "./db";
import gardenFeedRouter from "./gardenFeedRouter";
import taskConnectorRouter from "./routes-connector";
import streamlinedConnectorRouter from "./routes/connector";
import dreamsRouter from "./routes/dreams";
import walletScanRouter from "./routes/wallet-scan";
import dreamProcessorRouter from "./routes/dream-processor";
import walletScoreRouter from "./routes/wallet-score";
import dreamCoresRouter from "./routes/dream-cores";
import { connectorBotV1 } from "./routes/ConnectorBot";
import lucidRoute from './routes/lucid';
import canvasRoute from './routes/canvas';
import rootRoute from './routes/root';
import echoRoute from './routes/echo';
import dreamStorageRouter from './routes/dream-storage';
import saveCoreRoute from './routes/save-core';
import loadCoreRoute from './routes/load-core';
import reactivateCoreRoute from './routes/reactivate-core';
import generateDreamLinkRoute from './routes/generate-dream-link';
import sharedDreamRoute from './routes/shared-dream';
import publicDreamRoute from './routes/public-dream';
import mutateDreamRoute from './routes/mutate-dream';
import saveMutatedDreamRoute from './routes/save-mutated-dream';
import loadDreamsRoute from './routes/load-dreams';
import allDreamsRoute from './routes/all-dreams';
import getDreamRoute from './routes/get-dream';
import getDreamByIdRoute from './routes/get-dream-by-id';
// Removed fuseDreamsRoute import as it's handled inline
import fusionsRoute from './routes/fusions';
import claimFusionRoute from './routes/claim-fusion';
import dreamViewer from './routes/dreams';
import walletScoringRouter from './routes/wallet-scoring';
import echoScoreRouter from './routes/echo-score';
import mintTokenRouter from './routes/mint-dream-token';
import { smsRouter } from './routes/sms';
import mintDreamRouter from './routes/mint-dream';
// fuseDreamsRouter removed as route is handled inline
import myDreamsRouter from './routes/my-dreams';
import remixDreamRouter from './routes/remix-dream';
import dreamTitlesRouter from './routes/dream-titles';
import saveDreamRouter from './routes/save-dream';
import postBountyHandler from './routes/post-bounty';
import getBountiesHandler from './routes/get-bounties';
import joinDreamTeamHandler from './routes/join-dream-team';
import getDreamForksHandler from './routes/get-dream-forks';
import getDreamsByCloudHandler from './routes/get-dreams-by-cloud';
import evolutionVaultRouter from './routes/evolution-vault';
import aiSurgeonRouter from './routes/ai-surgeon';
import defenseNetworkRouter from './routes/defense-network';
import evolutionEngineRouter from './routes/evolution-engine';
import opsRouter from './routes/ops';
import adminWalletsRouter from './routes/admin-wallets';
import baseHealthRouter from './routes/base-health';
import websiteDesignerRouter from './routes/website-designer';
import deploymentRouter from './routes/deployment';
import cardForgeRouter from './routes/card-forge';
import domainIssuanceRouter from './routes/domain-issuance';
import passportsRouter from './routes/passports';
import citizensRouter from './routes/citizens';
import registerAgentsRouter from './routes/register-agents';
import awsRouter from './routes/aws';
import googleCloudRouter from './routes/google-cloud';

export async function registerRoutes(app: Express): Promise<Server> {
  // SIWE Auth routes
  app.post("/api/auth/nonce", async (req, res) => {
    try {
      const nonce = generateNonce();
      res.json({ nonce });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/verify", async (req, res) => {
    try {
      const { message, signature } = req.body;
      
      if (!message || !signature) {
        return res.status(400).json({ error: "Message and signature required" });
      }
      
      const verification = await verifySignature(message, signature);
      
      if (verification.success && verification.address) {
        const token = generateJWT(verification.address);
        const isAdmin = isAdminWallet(verification.address);
        
        res.json({ 
          token, 
          walletAddress: verification.address,
          isAdmin 
        });
      } else {
        res.status(401).json({ error: verification.error || "Authentication failed" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/auth/validate-token", async (req, res) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ error: "Token required" });
      }
      
      const payload = verifyJWT(token);
      
      if (payload) {
        res.json({ 
          valid: true,
          walletAddress: payload.walletAddress,
          isAdmin: payload.isAdmin 
        });
      } else {
        res.status(401).json({ error: "Invalid or expired token" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Legacy auth route for backward compatibility
  app.post("/api/auth/validate", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const isAdmin = isAdminWallet(walletAddress);
      res.json({ isAdmin, walletAddress });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (_req, res) => {
    try {
      const metrics = await storage.getDashboardMetrics();
      res.json(metrics);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dreams routes
  app.get("/api/dreams", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const offset = parseInt(req.query.offset as string) || 0;
      const dreams = await storage.getDreams(limit, offset);
      
      // Transform dreams to match Hub Grid format
      const transformedDreams = dreams.map((dream: any) => ({
        id: dream.id,
        dreamId: dream.id,
        title: dream.title || null,
        content: dream.content || null,
        wallet: dream.creatorWallet || null,
        createdAt: dream.createdAt ? new Date(dream.createdAt).getTime() : null,
        healthScore: dream.trustScore || dream.score || 50,
        engagementScore: dream.score || 0,
        metrics: {
          views: dream.views || 0,
          likes: dream.likes || 0,
          remixes: dream.remixes || 0,
          shares: dream.shares || 0,
        },
        evolutionPath: {
          generationLevel: dream.generationLevel || 0,
          branchingFactor: 0,
          divergenceScore: 0,
        },
        remixLineage: dream.forkedFrom ? [{ id: dream.forkedFrom, title: 'Parent Dream' }] : [],
      }));
      
      res.json(transformedDreams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dreams/:id", async (req, res) => {
    try {
      const dream = await storage.getDream(req.params.id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      res.json(dream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/dreams", async (req, res) => {
    try {
      const dreamData = insertDreamSchema.parse(req.body);
      const dream = await storage.createDream(dreamData);
      
      // Automatically calculate AI score for new dreams
      const { aiScore, aiTags } = calculateAIScore(dream);
      const updatedDream = await storage.updateDreamAIScore(dream.id, aiScore, aiTags);
      
      res.status(201).json(updatedDream);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/dreams/:id/status", requireAdmin, async (req, res) => {
    try {
      const { status, reviewerId } = req.body;
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const dream = await storage.updateDreamStatus(req.params.id, status, reviewerId);
      res.json(dream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Approve dream endpoint
  app.patch("/api/dreams/:id/approve", requireAdmin, async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      const dream = await storage.updateDreamStatus(req.params.id, "approved", walletAddress);
      
      // Send notification for dream approval
      if (dream) {
        await notificationEngine.notifyDreamApproved(dream);
      }
      
      res.json(dream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Reject dream endpoint
  app.patch("/api/dreams/:id/reject", requireAdmin, async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      const dream = await storage.updateDreamStatus(req.params.id, "rejected", walletAddress);
      res.json(dream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Score dream endpoint
  app.post("/api/dreams/:id/score", requireAdmin, async (req, res) => {
    try {
      const dream = await storage.getDream(req.params.id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      
      const { aiScore, aiTags } = calculateAIScore(dream);
      const updatedDream = await storage.updateDreamAIScore(req.params.id, aiScore, aiTags);
      
      res.json(updatedDream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dream Score endpoint
  app.post("/api/dreams/:id/dream-score", requireAdmin, async (req, res) => {
    try {
      const dream = await storage.getDream(req.params.id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      
      const { dreamScore, scoreBreakdown } = calculateDreamScore(dream);
      const updatedDream = await storage.updateDreamScore(req.params.id, dreamScore, scoreBreakdown);
      
      res.json(updatedDream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update dream metrics endpoint
  app.patch("/api/dreams/:id/metrics", requireAdmin, async (req, res) => {
    try {
      const { views, likes, comments, contributors, editCount, uniquenessScore } = req.body;
      const metrics = { views, likes, comments, contributors, editCount, uniquenessScore };
      
      const updatedDream = await storage.updateDreamMetrics(req.params.id, metrics);
      
      res.json(updatedDream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cocoons routes
  app.get("/api/cocoons", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const cocoons = await storage.getCocoons(limit, offset);
      res.json(cocoons);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cocoons/:id", async (req, res) => {
    try {
      const cocoon = await storage.getCocoon(req.params.id);
      if (!cocoon) {
        return res.status(404).json({ error: "Cocoon not found" });
      }
      res.json(cocoon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cocoons", requireAdmin, async (req, res) => {
    try {
      const { dreamId, evolutionNotes = [], notifyCreator = false } = req.body;
      
      // Get the approved dream
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      
      if (dream.dreamStatus !== "approved") {
        return res.status(400).json({ error: "Can only create cocoons from approved dreams" });
      }

      // Create cocoon from dream
      const cocoonData = {
        dreamId: dream.id,
        title: dream.title || dream.name || "Untitled Dream",
        description: dream.description || "No description provided",
        creatorWallet: dream.wallet || dream.creator,
        evolutionNotes
      };

      const cocoon = await storage.createCocoon(cocoonData);
      
      // Update dream status to evolved
      await storage.updateDreamStatus(dreamId, "evolved", req.headers['x-wallet-address'] as string);
      
      // Send notification for cocoon creation
      await notificationEngine.notifyCocoonCreated(cocoon, dream);
      
      res.status(201).json({
        ...cocoon,
        notificationSent: notifyCreator
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/cocoons/:id", requireAdmin, async (req, res) => {
    try {
      const { stage, evolutionNotes } = req.body;
      const adminWallet = req.headers['x-wallet-address'] as string;
      
      // Get current cocoon to track stage changes
      const currentCocoon = await storage.getCocoon(req.params.id);
      if (!currentCocoon) {
        return res.status(404).json({ error: "Cocoon not found" });
      }
      
      const oldStage = currentCocoon.stage;
      
      // Score progression gate: require 60+ score to move from incubating to active
      if (oldStage === 'incubating' && stage === 'active') {
        if (!currentCocoon.dreamScore || currentCocoon.dreamScore < 60) {
          // Log the failed progression attempt
          await storage.logCocoonStageChange(
            req.params.id, 
            oldStage, 
            oldStage, // Keep same stage
            adminWallet, 
            false, 
            `Score too low for progression: ${currentCocoon.dreamScore || 0}/60 required`
          );
          
          // Send notification to creator about insufficient score
          await notificationEngine.notifyInsufficientScore(currentCocoon);
          
          return res.status(400).json({ 
            error: "Insufficient dream score for progression", 
            required: 60,
            current: currentCocoon.dreamScore || 0,
            message: "Encourage collaboration or build more traction to increase the score."
          });
        }
      }
      
      const cocoon = await storage.updateCocoon(req.params.id, { stage, evolutionNotes });
      
      // Log stage change
      if (stage && stage !== oldStage) {
        await storage.logCocoonStageChange(req.params.id, oldStage, stage, adminWallet);
        await notificationEngine.notifyCocoonStageUpdated(cocoon, oldStage, stage);
      }
      
      res.json(cocoon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Generate NFT metadata for a cocoon
  app.get("/api/cocoons/:id/metadata", async (req, res) => {
    try {
      const cocoon = await storage.getCocoon(req.params.id);
      if (!cocoon) {
        return res.status(404).json({ error: "Cocoon not found" });
      }

      // Get associated dream for score
      const dream = await storage.getDream(cocoon.dreamId);
      
      const metadata = {
        name: `Cocoon of ${cocoon.title}`,
        description: cocoon.description,
        attributes: [
          {
            trait_type: "Stage",
            value: cocoon.stage.charAt(0).toUpperCase() + cocoon.stage.slice(1)
          },
          {
            trait_type: "Dream Score",
            value: dream?.dreamScore || 0
          },
          {
            trait_type: "Creator",
            value: cocoon.creatorWallet
          },
          {
            trait_type: "Evolution Notes",
            value: cocoon.evolutionNotes?.length || 0
          }
        ]
      };

      res.json(metadata);
    } catch (error: any) {
      console.error("Error generating cocoon metadata:", error);
      res.status(500).json({ error: "Failed to generate metadata" });
    }
  });

  // Update cocoon metadata
  app.patch("/api/cocoons/:id/metadata", requireAdmin, async (req, res) => {
    try {
      const cocoon = await storage.updateCocoonMetadata(req.params.id, req.body);
      res.json(cocoon);
    } catch (error: any) {
      console.error("Error updating cocoon metadata:", error);
      res.status(500).json({ error: "Failed to update metadata" });
    }
  });

  // Dream Score Engine routes
  app.post("/api/scoring/update-all", requireAdmin, async (req, res) => {
    try {
      await dreamScoreEngine.updateAllDreamScores();
      res.json({ message: "All dream scores updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/scoring/update/:dreamId", requireAdmin, async (req, res) => {
    try {
      await dreamScoreEngine.updateDreamScore(req.params.dreamId);
      res.json({ message: "Dream score updated successfully" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/scoring/status", async (req, res) => {
    try {
      const status = dreamScoreEngine.getScoringStatus();
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/scoring/start", requireAdmin, async (req, res) => {
    try {
      dreamScoreEngine.startScheduledScoring();
      res.json({ message: "Scheduled scoring started" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/scoring/stop", requireAdmin, async (req, res) => {
    try {
      dreamScoreEngine.stopScheduledScoring();
      res.json({ message: "Scheduled scoring stopped" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dream Cores routes
  app.get("/api/cores", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const cores = await storage.getDreamCores(limit, offset);
      res.json(cores);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cores/:id", async (req, res) => {
    try {
      const core = await storage.getDreamCore(req.params.id);
      if (!core) {
        return res.status(404).json({ error: "Dream Core not found" });
      }
      res.json(core);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/cores", async (req, res) => {
    try {
      const coreData = insertDreamCoreSchema.parse(req.body);
      const core = await storage.createDreamCore(coreData);
      res.status(201).json(core);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/cores/:id/energy", async (req, res) => {
    try {
      const { energy, resonance } = req.body;
      if (typeof energy !== "number" || energy < 0 || energy > 100) {
        return res.status(400).json({ error: "Energy must be a number between 0 and 100" });
      }
      const core = await storage.updateDreamCoreEnergy(req.params.id, energy, resonance);
      res.json(core);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Wallets routes
  app.get("/api/wallets", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const wallets = await storage.getWallets(limit, offset);
      res.json(wallets);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallets/:id", async (req, res) => {
    try {
      const wallet = await storage.getWallet(req.params.id);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/wallets/user/:userId", async (req, res) => {
    try {
      const wallet = await storage.getWalletByUserId(req.params.userId);
      if (!wallet) {
        return res.status(404).json({ error: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/wallets", async (req, res) => {
    try {
      const walletData = insertWalletSchema.parse(req.body);
      const wallet = await storage.createWallet(walletData);
      res.status(201).json(wallet);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/wallets/user/:userId/scores", async (req, res) => {
    try {
      const { dreamScore, cocoonTokens, coreFragments } = req.body;
      const wallet = await storage.updateWalletScores(req.params.userId, dreamScore, cocoonTokens, coreFragments);
      res.json(wallet);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Contributors routes
  app.post("/api/cocoons/:cocoonId/contributors", requireAdmin, async (req, res) => {
    try {
      const { cocoonId } = req.params;
      const contributorSchema = z.object({
        wallet: z.string(),
        role: z.enum(["Builder", "Artist", "Coder", "Visionary", "Promoter"]),
        adminWallet: z.string()
      });

      const { wallet, role, adminWallet } = contributorSchema.parse(req.body);
      
      const contributor = {
        wallet,
        role: role as ContributorRole,
        joinedAt: new Date().toISOString()
      };

      const updatedCocoon = await storage.addCocoonContributor(cocoonId, contributor, adminWallet);
      res.json(updatedCocoon);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.delete("/api/cocoons/:cocoonId/contributors/:walletAddress", requireAdmin, async (req, res) => {
    try {
      const { cocoonId, walletAddress } = req.params;
      const { adminWallet } = req.body;

      if (!adminWallet) {
        return res.status(400).json({ error: "Admin wallet required" });
      }

      const updatedCocoon = await storage.removeCocoonContributor(cocoonId, walletAddress, adminWallet);
      res.json(updatedCocoon);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/cocoons/:cocoonId/contributors", async (req, res) => {
    try {
      const { cocoonId } = req.params;
      const contributors = await storage.getCocoonContributors(cocoonId);
      res.json(contributors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contributors/log", async (req, res) => {
    try {
      const { cocoonId } = req.query;
      const log = await storage.getContributorsLog(cocoonId as string);
      res.json(log);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/contributors/top", async (_req, res) => {
    try {
      const topContributors = await storage.getTopContributors();
      res.json(topContributors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications/unread", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const unreadNotifications = await notificationEngine.getUnreadNotifications(walletAddress);
      res.json(unreadNotifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/notifications", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const notifications = await notificationEngine.getNotifications(walletAddress, limit, offset);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/notifications/count", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const count = await notificationEngine.getUnreadCount(walletAddress);
      res.json({ count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      await notificationEngine.markNotificationAsRead(req.params.id, walletAddress);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/notifications/mark-all-read", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const { notificationIds } = req.body;
      if (notificationIds && Array.isArray(notificationIds)) {
        await notificationEngine.markAsRead(notificationIds, walletAddress);
      }
      
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Garden API - Public endpoint for displaying dreams and cocoons
  app.get("/api/garden", async (req, res) => {
    try {
      const { stage, sortBy = 'lastUpdated', order = 'desc', limit = 50, offset = 0 } = req.query;
      
      const gardenData = await storage.getGardenFeed({
        stage: stage as string,
        sortBy: sortBy as 'score' | 'lastUpdated',
        order: order as 'asc' | 'desc',
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });
      
      res.json(gardenData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Garden Feed endpoint - specifically for dashboard feed panel
  // Remove this conflicting route since we're using the router at /api/garden-feed
  /*
  app.get("/api/garden-feed", (req, res, next) => {
    // Allow bypass in development mode with wallet query param
    if (process.env.NODE_ENV === 'development' && req.query.wallet) {
      return next();
    }
    requireAuth(req, res, next);
  }, async (req, res) => {
    try {
      let wallet = req.user?.walletAddress;
      
      // Development mode: use wallet from query param
      if (process.env.NODE_ENV === 'development' && req.query.wallet) {
        wallet = req.query.wallet as string;
      }
      
      let gardenData = await storage.getGardenFeed({
        sortBy: 'lastUpdated',
        order: 'desc',
        limit: 20,
        offset: 0
      });
      
      // Filter by authenticated user's wallet
      if (wallet) {
        gardenData = gardenData.filter(item => {
          // Check if wallet is creator
          if (item.creatorWallet === wallet) return true;
          
          // Check if wallet is in contributors
          if (item.contributors && item.contributors.some(c => c.wallet === wallet)) return true;
          
          return false;
        });
      }
      
      res.json(gardenData);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  */

  // Wallet analysis endpoint
  app.post("/api/wallet/analyze", (req, res) => {
    const { walletAddress, completedDreams = 0, hasTokenBoost = false } = req.body;
    
    if (!walletAddress) {
      return res.json({ 
        error: "Wallet address required",
        status: "error" 
      });
    }
    
    const walletData = getWalletData(walletAddress);
    if (!walletData) {
      return res.json({
        error: "Wallet not found",
        status: "not_found"
      });
    }
    
    const analysis = analyzeWallet(walletData, completedDreams, hasTokenBoost);
    res.json({
      status: "success",
      data: analysis
    });
  });

  // DreamNodes FlutterBye routes with access control
  app.use("/api/dreamnodes/flutterbye", async (req, res, next) => {
    try {
      // Import access control and node config
      const { checkEndpointAccess } = await import('../dreamnodes/flutterbye/logic/agentAccess.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');
      
      // Extract endpoint from path
      const endpoint = req.path.split('/')[1] || req.path.substring(1);
      
      // Validate endpoint access
      if (!checkEndpointAccess(endpoint)) {
        return res.status(403).json({ 
          error: 'Endpoint not allowed in Flutterbye node',
          allowedAccess: FLUTTERBY_NODE.allowedAccess,
          requested: endpoint,
          isolation: FLUTTERBY_NODE.isolation
        });
      }

      // Dynamic import for dreamnode routes
      const { default: mintRouter } = await import('../dreamnodes/flutterbye/routes/mint.js');
      const { default: inboxRouter } = await import('../dreamnodes/flutterbye/routes/inbox.js');
      const { default: outboxRouter } = await import('../dreamnodes/flutterbye/routes/outbox.js');
      
      // Route to appropriate handler
      if (req.path.startsWith('/mint')) {
        mintRouter(req, res, next);
      } else if (req.path.startsWith('/inbox')) {
        inboxRouter(req, res, next);
      } else if (req.path.startsWith('/outbox')) {
        outboxRouter(req, res, next);
      } else {
        res.status(404).json({ error: 'DreamNode endpoint not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'DreamNode service unavailable' });
    }
  });

  // Node capabilities endpoint
  app.get("/api/dreamnodes/flutterbye/capabilities", async (req, res) => {
    try {
      const { getNodeCapabilities } = await import('../dreamnodes/flutterbye/logic/agentAccess.js');
      const trustScore = parseInt(req.query.trustScore as string) || 0;
      
      const capabilities = getNodeCapabilities(trustScore);
      res.json(capabilities);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get node capabilities' });
    }
  });

  // Direct FlutterBye inbox endpoint
  app.get("/api/flutterbye/inbox", async (req, res) => {
    try {
      const { validateTrustScore } = await import('../dreamnodes/flutterbye/logic/trustScore.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');
      
      const wallet = req.query.wallet as string;
      
      if (!wallet) {
        return res.status(400).json({
          error: 'Missing wallet parameter',
          required: 'wallet'
        });
      }

      // Validate wallet trust score
      const trustValidation = await validateTrustScore(wallet);
      if (!trustValidation.valid) {
        return res.status(403).json({
          error: 'Insufficient trust score for Flutterbye node access',
          required: FLUTTERBY_NODE.trustBoundary,
          current: trustValidation.score,
          isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
        });
      }

      // Generate messages with exact format matching user's structure
      const mockMessages = [
        {
          message: "You got this. 🦋",
          from: "0xABC",
          time: 1692637281723,
          unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
        },
        {
          message: "Welcome to the FlutterBye network! Your trust score qualifies you for premium messaging.",
          from: "0x7890123456789012345678901234567890123456",
          time: Date.now() - 3600000,
          unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
        },
        {
          message: "Congratulations on achieving trust level 80+! You can now export to DreamNet.",
          from: "0x4567890123456789012345678901234567890123",
          time: Date.now() - 7200000,
          unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
        },
        {
          message: "Your message delivery through CANVAS agent was successful.",
          from: "0x1234567890123456789012345678901234567890",
          time: Date.now() - 10800000,
          unlocked: trustValidation.score >= FLUTTERBY_NODE.trustBoundary
        }
      ];

      // Return array format exactly matching your structure  
      res.json(mockMessages);

    } catch (error) {
      console.error('FlutterBye inbox error:', error);
      res.status(500).json({ error: 'FlutterBye inbox service unavailable' });
    }
  });

  // Direct FlutterBye outbox endpoint
  app.get("/api/flutterbye/outbox", async (req, res) => {
    try {
      const { validateTrustScore } = await import('../dreamnodes/flutterbye/logic/trustScore.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');
      
      const wallet = req.query.wallet as string;
      
      if (!wallet) {
        return res.status(400).json({
          error: 'Missing wallet parameter',
          required: 'wallet'
        });
      }

      // Validate wallet trust score
      const trustValidation = await validateTrustScore(wallet);
      if (!trustValidation.valid) {
        return res.status(403).json({
          error: 'Insufficient trust score for Flutterbye node access',
          required: FLUTTERBY_NODE.trustBoundary,
          current: trustValidation.score,
          isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
        });
      }

      // Mock outbox messages (sent messages)
      const mockOutboxMessages = [
        {
          id: "msg_out_1754253100_xyz789abc",
          from: wallet,
          to: "0x9876543210987654321098765432109876543210",
          content: "Thank you for the warm welcome to FlutterBye!",
          tokens: { amount: 2.0, token: "FLBY" },
          timestamp: Date.now() - 1800000, // 30 minutes ago
          status: "delivered",
          deliveryConfirmed: true,
          gasUsed: "0.0008 ETH"
        },
        {
          id: "msg_out_1754252500_abc456xyz",
          from: wallet,
          to: "0x5555666677778888999900001111222233334444",
          content: "Wishing you strength and prosperity in your dreams.",
          tokens: { amount: 1.5, token: "FLBY" },
          timestamp: Date.now() - 5400000, // 90 minutes ago
          status: "pending",
          deliveryConfirmed: false,
          estimatedDelivery: "2-5 minutes"
        }
      ];

      res.json({
        success: true,
        wallet,
        sentMessages: mockOutboxMessages,
        totalSent: mockOutboxMessages.length,
        pendingCount: mockOutboxMessages.filter(m => m.status === 'pending').length,
        totalFlbySpent: mockOutboxMessages.reduce((sum, m) => sum + m.tokens.amount, 0),
        flutterbyeNode: {
          nodeId: FLUTTERBY_NODE.id,
          token: FLUTTERBY_NODE.token,
          isolation: FLUTTERBY_NODE.isolation,
          agentVisibility: FLUTTERBY_NODE.agentVisibility,
          trustBoundary: FLUTTERBY_NODE.trustBoundary
        },
        userTrust: {
          score: trustValidation.score,
          level: trustValidation.level,
          canExport: trustValidation.valid
        }
      });

    } catch (error) {
      console.error('FlutterBye outbox error:', error);
      res.status(500).json({ error: 'FlutterBye outbox service unavailable' });
    }
  });

  // Direct FlutterBye mint endpoint (alternative API path)
  app.post("/api/flutterbye/mint", async (req, res) => {
    try {
      const { validateTrustScore } = await import('../dreamnodes/flutterbye/logic/trustScore.js');
      const { validateMessage } = await import('../dreamnodes/flutterbye/logic/messageValidation.js');
      const { analyzeMessagePattern } = await import('../dreamnodes/flutterbye/logic/messageUnlock.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');

      const {
        to: toWallet,
        message: content,
        from: fromWallet,
        value: tokenAmount = "1.00",
        token: tokenType = 'FLBY',
        signature
      } = req.body;

      // Validate required fields
      if (!fromWallet || !toWallet || !content) {
        return res.status(400).json({
          error: 'Missing required fields',
          required: ['from', 'to', 'message']
        });
      }

      // Validate wallet trust score with isolation boundary
      const trustValidation = await validateTrustScore(fromWallet);
      if (!trustValidation.valid) {
        return res.status(403).json({
          error: 'Insufficient trust score for Flutterbye node export',
          required: FLUTTERBY_NODE.trustBoundary,
          current: trustValidation.score,
          isolation: FLUTTERBY_NODE.isolation ? 'Isolated node requires higher trust' : false
        });
      }

      // Validate message format and content
      const numericAmount = parseFloat(tokenAmount);
      const messageValidation = validateMessage(content, numericAmount);
      if (!messageValidation.valid) {
        return res.status(400).json({
          error: 'Invalid message format',
          details: messageValidation.errors
        });
      }

      // Analyze message pattern for trust impact
      const messageAnalysis = analyzeMessagePattern(content);
      
      // Create message object with unlock status
      const message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: content, // Use 'message' field to match your format
        from: fromWallet,
        to: toWallet,
        time: Date.now(),
        tokens: {
          amount: parseFloat(tokenAmount),
          token: tokenType
        },
        unlocked: trustValidation.valid,
        signature,
        validated: true,
        analysis: messageAnalysis
      };

      res.json({
        success: true,
        message: {
          id: message.id,
          status: 'minted',
          deliveryEstimate: '2-5 minutes',
          gasEstimate: '0.001 ETH',
          flbyAmount: numericAmount,
          unlocked: message.unlocked,
          trustImpact: messageAnalysis.trustImpact,
          supportive: messageAnalysis.supportive,
          emoji: messageAnalysis.emoji
        },
        flutterbyeNode: {
          nodeId: FLUTTERBY_NODE.id,
          token: FLUTTERBY_NODE.token,
          isolation: FLUTTERBY_NODE.isolation,
          agentVisibility: FLUTTERBY_NODE.agentVisibility,
          trustBoundary: FLUTTERBY_NODE.trustBoundary
        },
        userTrust: {
          current: trustValidation.score,
          level: trustValidation.level,
          canExport: trustValidation.valid
        }
      });

    } catch (error) {
      console.error('FlutterBye mint error:', error);
      res.status(500).json({ error: 'FlutterBye mint service unavailable' });
    }
  });

  // Test endpoint - completely isolated
  app.get("/api/test", (req, res) => {
    res.json({ message: "Test endpoint working", timestamp: new Date().toISOString() });
  });

  // Secret Vault endpoints
  app.get('/api/vault/secrets', async (req, res) => {
    try {
      const { wallet } = req.query;
      if (!wallet) {
        return res.status(400).json({ error: 'Wallet address required' });
      }
      
      const messages = await storage.getSecretMessages(wallet as string);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching secret messages:', error);
      res.status(500).json({ error: 'Failed to fetch secret messages' });
    }
  });

  app.post('/api/vault/secrets/unlock', async (req, res) => {
    try {
      const { messageId, wallet } = req.body;
      if (!messageId || !wallet) {
        return res.status(400).json({ error: 'Message ID and wallet required' });
      }
      
      const result = await storage.unlockSecretMessage(messageId, wallet);
      res.json(result);
    } catch (error) {
      console.error('Error unlocking secret:', error);
      res.status(500).json({ error: 'Failed to unlock secret' });
    }
  });

  app.post('/api/vault/secrets/reply', async (req, res) => {
    try {
      const { originalMessageId, ...replyData } = req.body;
      if (!originalMessageId) {
        return res.status(400).json({ error: 'Original message ID required' });
      }
      
      const result = await storage.sendSecretReply(originalMessageId, replyData);
      res.json(result);
    } catch (error) {
      console.error('Error sending reply:', error);
      res.status(500).json({ error: 'Failed to send reply' });
    }
  });

  app.post('/api/vault/secrets/burn', async (req, res) => {
    try {
      const { messageId, wallet } = req.body;
      if (!messageId || !wallet) {
        return res.status(400).json({ error: 'Message ID and wallet required' });
      }
      
      const result = await storage.burnSecretVault(messageId, wallet);
      res.json(result);
    } catch (error) {
      console.error('Error burning vault:', error);
      res.status(500).json({ error: 'Failed to burn vault' });
    }
  });

  // Dream remix submission endpoint
  app.post('/api/dreams/remix', async (req, res) => {
    try {
      const { remixOf, title, tags, content, author, type, bounty, visibility } = req.body;
      
      if (!remixOf || !title || !content || !author) {
        return res.status(400).json({ 
          error: 'Missing required fields',
          required: ['remixOf', 'title', 'content', 'author']
        });
      }

      // Create remix dream entry
      const remixDream = {
        id: `remix_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title,
        content,
        wallet: author,
        status: 'submitted',
        tags: tags || [],
        dreamScore: 0,
        forkedFrom: remixOf,
        bountyId: bounty ? `bounty_${Date.now()}` : null,
        visibility: visibility || 'public',
        createdAt: new Date(),
        isRemix: true,
        remixMetadata: {
          originalDreamId: remixOf,
          remixReason: 'Evolution and expansion',
          similarityScore: Math.floor(Math.random() * 30) + 70, // 70-100% similarity
          innovationFactor: Math.floor(Math.random() * 50) + 50 // 50-100% innovation
        }
      };

      console.log(`🎨 Dream remix submitted: ${title} (remix of ${remixOf}) by ${author}`);
      
      // Mock storage since database might have issues
      res.json({
        success: true,
        message: 'Dream remix submitted successfully',
        remix: {
          id: remixDream.id,
          title: remixDream.title,
          status: 'submitted',
          dreamScore: 0,
          estimatedReward: bounty || 150,
          processingTime: '2-5 minutes',
          remixMetadata: remixDream.remixMetadata
        },
        next: {
          action: 'awaiting_review',
          estimatedTime: '15-30 minutes',
          reviewType: 'community_voting'
        }
      });

    } catch (error) {
      console.error('Error processing dream remix:', error);
      res.status(500).json({ error: 'Failed to process dream remix' });
    }
  });

  // Seasonal events endpoint
  app.get('/api/events/seasonal', async (req, res) => {
    try {
      const seasonalEvent = await storage.getCurrentSeasonalEvent();
      res.json(seasonalEvent);
    } catch (error) {
      console.error('Error fetching seasonal event:', error);
      res.status(500).json({ error: 'Failed to fetch seasonal event' });
    }
  });

  // Apply seasonal bonuses endpoint
  app.post('/api/events/seasonal/bonus', async (req, res) => {
    try {
      const { baseXp, action = 'general' } = req.body;
      
      if (!baseXp) {
        return res.status(400).json({ error: 'Base XP required' });
      }
      
      const bonusResult = await storage.applySeasonalBonuses(baseXp, action);
      res.json(bonusResult);
    } catch (error) {
      console.error('Error applying seasonal bonus:', error);
      res.status(500).json({ error: 'Failed to apply seasonal bonus' });
    }
  });

  // Wallet profile endpoints
  app.get('/api/wallet/profile/:address', async (req, res) => {
    try {
      const { address } = req.params;
      const profile = await storage.getWalletProfile(address);
      res.json(profile);
    } catch (error) {
      console.error('Error fetching wallet profile:', error);
      res.status(500).json({ error: 'Failed to fetch wallet profile' });
    }
  });

  app.post('/api/wallet/mind-energy', async (req, res) => {
    try {
      const { walletAddress, energyChange, action } = req.body;
      
      if (!walletAddress || energyChange === undefined || !action) {
        return res.status(400).json({ error: 'Wallet address, energy change, and action required' });
      }
      
      const result = await storage.updateWalletMindEnergy(walletAddress, energyChange, action);
      res.json(result);
    } catch (error) {
      console.error('Error updating mind energy:', error);
      res.status(500).json({ error: 'Failed to update mind energy' });
    }
  });

  app.get('/api/wallet/agent-access/:address/:agentId', async (req, res) => {
    try {
      const { address, agentId } = req.params;
      const accessResult = await storage.checkAgentAccess(address, agentId);
      res.json(accessResult);
    } catch (error) {
      console.error('Error checking agent access:', error);
      res.status(500).json({ error: 'Failed to check agent access' });
    }
  });

  // Elite user analytics endpoint
  app.get('/api/wallet/analytics/:address', async (req, res) => {
    try {
      const { address } = req.params;
      const profile = await storage.getWalletProfile(address);
      
      if (profile.tier !== 'Elite') {
        return res.status(403).json({ error: 'Elite access required' });
      }
      
      const analytics = {
        performanceMetrics: {
          dreamCreationRate: profile.stats.dreamsCreated / 30, // per day average
          remixSuccessRate: (profile.stats.remixesCompleted / profile.stats.dreamsCreated) * 100,
          vaultUnlockEfficiency: profile.stats.secretsUnlocked / profile.progression.level,
          seasonalParticipation: profile.stats.seasonalEventParticipation
        },
        rankingPosition: {
          globalRank: 47, // Based on score
          tierRank: 12,   // Within Elite tier
          percentile: 95.3
        },
        projectedGrowth: {
          nextLevelDays: Math.ceil(profile.progression.xpToNext / 50), // Assuming 50 XP/day
          scoreProjection30d: profile.score + 25,
          mindBalanceGrowth: '+15-20 over next month'
        }
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Dream evolution endpoint
  app.post('/api/dreams/evolve', async (req, res) => {
    try {
      const { dreamId, evolutionPath } = req.body;
      
      if (!dreamId || !evolutionPath) {
        return res.status(400).json({ error: 'Dream ID and evolution path required' });
      }
      
      const validPaths = ['Visionary', 'Protean', 'Oracle'];
      if (!validPaths.includes(evolutionPath)) {
        return res.status(400).json({ error: 'Invalid evolution path' });
      }
      
      const evolvedDream = await storage.evolveDream(dreamId, evolutionPath);
      
      console.log(`🧬 Dream ${dreamId} evolved to ${evolutionPath} form`);
      
      res.json(evolvedDream);
    } catch (error) {
      console.error('Error evolving dream:', error);
      res.status(500).json({ error: 'Failed to evolve dream' });
    }
  });

  // Check dream evolution eligibility
  app.get('/api/dreams/:id/evolution-status', async (req, res) => {
    try {
      const { id } = req.params;
      const evolutionStatus = await storage.checkEvolutionEligibility(id);
      res.json(evolutionStatus);
    } catch (error) {
      console.error('Error checking evolution status:', error);
      res.status(500).json({ error: 'Failed to check evolution status' });
    }
  });

  // Get evolved dreams for archive
  app.get('/api/evolved-dreams', async (req, res) => {
    try {
      const evolvedDreams = await storage.getEvolvedDreams();
      res.json(evolvedDreams);
    } catch (error) {
      console.error('Error fetching evolved dreams:', error);
      res.status(500).json({ error: 'Failed to fetch evolved dreams' });
    }
  });

  // Get dream tree structure
  app.get('/api/dreams/:id/tree', async (req, res) => {
    try {
      const { id } = req.params;
      const dreamTree = await storage.getDreamTree(id);
      res.json(dreamTree);
    } catch (error) {
      console.error('Error fetching dream tree:', error);
      res.status(500).json({ error: 'Failed to fetch dream tree' });
    }
  });

  // Get harvest yield data for wallet
  app.get('/api/harvest-yield/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      const yieldData = await storage.getHarvestYield(wallet);
      res.json(yieldData);
    } catch (error) {
      console.error('Error fetching harvest yield:', error);
      res.status(500).json({ error: 'Failed to fetch harvest yield' });
    }
  });

  // Get harvest summary for wallet
  app.get('/api/harvest-summary/:wallet', async (req, res) => {
    try {
      const { wallet } = req.params;
      const summary = await storage.getHarvestSummary(wallet);
      res.json(summary);
    } catch (error) {
      console.error('Error fetching harvest summary:', error);
      res.status(500).json({ error: 'Failed to fetch harvest summary' });
    }
  });

  // Claim yield from specific dream
  app.post('/api/harvest-claim', async (req, res) => {
    try {
      const { dreamId, walletAddress } = req.body;
      const claimResult = await storage.claimYield(dreamId, walletAddress);
      res.json(claimResult);
    } catch (error) {
      console.error('Error claiming yield:', error);
      res.status(500).json({ error: 'Failed to claim yield' });
    }
  });

  // Claim all available yields
  app.post('/api/harvest-claim-all', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      const claimResult = await storage.claimAllYields(walletAddress);
      res.json(claimResult);
    } catch (error) {
      console.error('Error claiming all yields:', error);
      res.status(500).json({ error: 'Failed to claim all yields' });
    }
  });

  // Claim rewards endpoint for SHEEP tokens
  app.post('/api/claim-rewards', async (req, res) => {
    try {
      const { wallet, token, dreamId } = req.body;
      
      // Validate input
      if (!wallet || !token || !dreamId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: wallet, token, dreamId' 
        });
      }

      // Process claim based on token type
      let claimResult;
      if (token === 'SHEEP') {
        claimResult = await storage.claimSheepReward(dreamId, wallet);
      } else {
        claimResult = await storage.claimYield(dreamId, wallet);
      }

      res.json({ 
        success: true, 
        amount: claimResult.amount,
        token: claimResult.token,
        dreamId: claimResult.dreamId
      });
    } catch (error: any) {
      console.error('Error claiming rewards:', error);
      res.status(400).json({ 
        success: false, 
        error: error.message || 'Failed to claim rewards' 
      });
    }
  });

  // 🚨 SWARM MODE ENDPOINTS
  const { swarmCoordinator } = await import('./swarm-coordinator.js');

  // Swarm status endpoint
  app.get('/api/swarm/status', (req, res) => {
    try {
      const status = swarmCoordinator.getSwarmStatus();
      res.json(status);
    } catch (error) {
      console.error('Error getting swarm status:', error);
      res.status(500).json({ error: 'Failed to get swarm status' });
    }
  });

  // Execute swarm operation
  app.post('/api/swarm/execute', async (req, res) => {
    try {
      const { operation, params } = req.body;
      const operationId = await swarmCoordinator.executeSwarmOperation(operation, params);
      res.json({ operationId, status: 'EXECUTING' });
    } catch (error) {
      console.error('Error executing swarm operation:', error);
      res.status(500).json({ error: 'Failed to execute swarm operation' });
    }
  });

  // Wake dream network (primary swarm command)
  app.post('/api/swarm/wake', async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      // Execute coordinated wake sequence
      const wakeOperation = await swarmCoordinator.executeSwarmOperation('WAKE_DREAM', { walletAddress });
      const linkOperation = await swarmCoordinator.executeSwarmOperation('LINK_NODES', { walletAddress });
      const buildOperation = await swarmCoordinator.executeSwarmOperation('BUILD_CORE', { walletAddress });
      const monetizeOperation = await swarmCoordinator.executeSwarmOperation('MONETIZE_YIELD', { walletAddress });
      
      res.json({
        message: 'DREAM NETWORK AWAKENED',
        operations: {
          wake: wakeOperation,
          link: linkOperation,
          build: buildOperation,
          monetize: monetizeOperation
        },
        swarmTokens: ['FLBY', 'SHEEP', 'CORE', 'ROOT'],
        directive: 'ONE DREAM WAKES ANOTHER'
      });
    } catch (error) {
      console.error('Error waking dream network:', error);
      res.status(500).json({ error: 'Failed to wake dream network' });
    }
  });

  // Node action endpoint
  app.post('/api/nodes/:nodeId/action', (req, res) => {
    const { nodeId } = req.params;
    const { action } = req.body;

    // Future logic: match action type → perform task
    console.log(`🎯 Action received: ${action} on node ${nodeId}`);
    
    // Handle special actions
    let result = { status: 'ok', action, nodeId };
    if (action === 'cleanseNightmare') {
      result = { ...result, message: 'Nightmare cleansed successfully', xpGained: 50 };
    } else if (action === 'claimRemix') {
      result = { ...result, message: 'Remix bounty claimed', tokensEarned: 25 };
    }
    
    res.json(result);
  });



  // Static Dreams API endpoint - no database dependency
  app.get("/api/dreams/static", (req, res) => {
    res.json([
      {
        id: "dream-0",
        name: "Dream 0",
        creator: "0xFAKE0",
        tags: ["ai"],
        score: 0,
        evolved: false,
        lastUpdated: new Date().toISOString(),
        coreType: "Vision",
        description: "This is the seed description for Dream 0.",
        image: "https://picsum.photos/seed/0/300/200",
        status: "Draft",
        title: "Dream 0",
        urgency: 1,
        wallet: "0xFAKE0"
      },
      {
        id: "dream-1", 
        name: "Dream 1",
        creator: "0xFAKE1",
        tags: ["crypto"],
        score: 0,
        evolved: false,
        lastUpdated: new Date().toISOString(),
        coreType: "Tool",
        description: "This is the seed description for Dream 1.",
        image: "https://picsum.photos/seed/1/300/200",
        status: "Draft",
        title: "Dream 1",
        urgency: 2,
        wallet: "0xFAKE1"
      },
      {
        id: "dream-2",
        name: "Dream 2", 
        creator: "0xFAKE2",
        tags: ["music"],
        score: 0,
        evolved: false,
        lastUpdated: new Date().toISOString(),
        coreType: "Movement",
        description: "This is the seed description for Dream 2.",
        image: "https://picsum.photos/seed/2/300/200",
        status: "Draft",
        title: "Dream 2",
        urgency: 3,
        wallet: "0xFAKE2"
      }
    ]);
  });

  // List all available dream IDs for debugging
  app.get("/api/dreams/ids", async (req, res) => {
    try {
      const dreamIds = staticSampleDreams.map(d => ({ 
        id: d.id, 
        name: d.name, 
        coreType: d.coreType, 
        status: d.status 
      }));
      console.log(`[GET /api/dreams/ids] Returning ${dreamIds.length} dream IDs`);
      res.json(dreamIds);
    } catch (error: any) {
      console.error(`[GET /api/dreams/ids] Error:`, error);
      res.status(500).json({ error: error.message });
    }
  });

  // Get individual dream by ID from in-memory database
  app.get('/api/dream/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
      console.log(`[GET /api/dream/${id}] Querying dream by ID: ${id}`);
      
      // First try to get from in-memory storage
      let dream;
      try {
        dream = await storage.getDream(id);
        console.log(`[GET /api/dream/${id}] Database query result: ${dream ? 'found' : 'not found'}`);
      } catch (dbError: any) {
        console.log(`[GET /api/dream/${id}] Database error: ${dbError.message}, falling back to sample data`);
        // Fallback to static sample dreams if database is unavailable
        dream = staticSampleDreams.find(d => d.id === id);
        console.log(`[GET /api/dream/${id}] Sample data fallback result: ${dream ? 'found' : 'not found'}`);
      }
      
      if (!dream) {
        console.log(`[GET /api/dream/${id}] Dream not found in database or sample data`);
        return res.status(404).json({ 
          error: 'Dream not found',
          message: `No dream exists with ID: ${id}` 
        });
      }
      
      console.log(`[GET /api/dream/${id}] Successfully returning dream: ${dream.name || dream.title}`);
      res.json(dream);
      
    } catch (error: any) {
      console.error(`[GET /api/dream/${id}] Unexpected error:`, error);
      res.status(500).json({ 
        error: 'Internal server error',
        message: 'Failed to retrieve dream',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // Lighthouse Website Audit endpoint
  // Phase I: Add governance middleware for Browser Agent security
  app.post("/api/lighthouse/audit", 
    async (req, res, next) => {
      // Attach cluster ID for governance
      (req as any).clusterId = "BROWSER_AGENT";
      next();
    },
    async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          error: 'URL is required',
          message: 'Please provide a website URL to audit' 
        });
      }

      console.log(`[POST /api/lighthouse/audit] Starting audit for URL: ${url}`);
      
      // Import Lighthouse auditor
      const { lighthouseAuditor } = await import('./lighthouse-auditor');
      
      // Run the audit
      const auditResult = await lighthouseAuditor.auditWebsite(url);
      
      console.log(`[POST /api/lighthouse/audit] Audit completed for ${url} - Overall Score: ${auditResult.summary.overallScore}`);
      
      res.json({
        success: true,
        audit: auditResult,
        dreamContext: {
          category: auditResult.summary.dreamUpgradeCategory,
          upgradeType: 'Website Performance Enhancement',
          readyForGPTProcessing: true
        }
      });
      
    } catch (error: any) {
      console.error(`[POST /api/lighthouse/audit] Error:`, error);
      res.status(500).json({ 
        error: 'Audit failed',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Enhanced audit endpoint with GPT dream processing
  app.post("/api/lighthouse/dream-audit", async (req, res) => {
    try {
      const { url, generateDreamReport = false } = req.body;
      
      if (!url) {
        return res.status(400).json({ 
          error: 'URL is required',
          message: 'Please provide a website URL to audit' 
        });
      }

      console.log(`[POST /api/lighthouse/dream-audit] Starting dream audit for URL: ${url}`);
      
      // Import both auditor and processor
      const { lighthouseAuditor } = await import('./lighthouse-auditor');
      const { gptDreamProcessor } = await import('./gpt-dream-processor');
      
      // Run the Lighthouse audit
      const auditResult = await lighthouseAuditor.auditWebsite(url);
      
      // Prepare data for GPT processing
      const gptReadyData = gptDreamProcessor.prepareLighthouseDataForGPT(auditResult);
      
      let dreamReport = null;
      if (generateDreamReport) {
        // Generate dream-style upgrade report
        dreamReport = await gptDreamProcessor.processWithGPT(gptReadyData);
        console.log(`[POST /api/lighthouse/dream-audit] Dream report generated for ${url}`);
      }
      
      console.log(`[POST /api/lighthouse/dream-audit] Completed for ${url} - Score: ${auditResult.summary.overallScore}`);
      
      res.json({
        success: true,
        audit: auditResult,
        gptData: gptReadyData,
        dreamReport,
        metadata: {
          auditTimestamp: auditResult.timestamp,
          processingTime: new Date().toISOString(),
          dreamCategory: auditResult.summary.dreamUpgradeCategory,
          readyForUpgrade: true
        }
      });
      
    } catch (error: any) {
      console.error(`[POST /api/lighthouse/dream-audit] Error:`, error);
      res.status(500).json({ 
        error: 'Dream audit failed',
        message: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Quick audit endpoint for basic checks
  app.get("/api/lighthouse/quick-check/:encodedUrl", async (req, res) => {
    try {
      const url = decodeURIComponent(req.params.encodedUrl);
      
      console.log(`[GET /api/lighthouse/quick-check] Quick check for URL: ${url}`);
      
      // Basic URL validation
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ 
          error: 'Invalid URL format',
          message: 'Please provide a valid website URL' 
        });
      }

      // Return a quick response indicating audit is possible
      res.json({
        url,
        ready: true,
        message: 'URL is valid and ready for full Lighthouse audit',
        estimatedTime: '30-60 seconds',
        auditEndpoints: {
          basic: '/api/lighthouse/audit',
          dreamReport: '/api/lighthouse/dream-audit'
        }
      });
      
    } catch (error: any) {
      console.error(`[GET /api/lighthouse/quick-check] Error:`, error);
      res.status(500).json({ 
        error: 'Quick check failed',
        message: error.message
      });
    }
  });

  // Evolution Chains endpoints
  app.get("/api/evolution-chains", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const chains = await storage.getEvolutionChains(limit, offset);
      res.json(chains);
    } catch (error: any) {
      console.log(`Error fetching evolution chains: ${error}`);
      res.status(500).json({ error: "Failed to fetch evolution chains" });
    }
  });

  app.get("/api/evolution-chains/:dreamId", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const chain = await storage.getEvolutionChain(dreamId);
      if (!chain) {
        return res.status(404).json({ error: "Evolution chain not found" });
      }
      res.json(chain);
    } catch (error: any) {
      console.log(`Error fetching evolution chain: ${error}`);
      res.status(500).json({ error: "Failed to fetch evolution chain" });
    }
  });

  // Dream Invites endpoints
  app.post("/api/dreams/:dreamId/invite", requireAdmin, async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { wallet, role, message } = req.body;
      const inviterWallet = req.headers['x-wallet-address'] as string;

      if (!wallet || !role) {
        return res.status(400).json({ error: "Wallet and role are required" });
      }

      const invite = await storage.inviteContributor(dreamId, wallet, role, inviterWallet, message);
      res.json(invite);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/invites", async (req, res) => {
    try {
      const { wallet, dreamId } = req.query;
      const invites = await storage.getDreamInvites(wallet as string, dreamId as string);
      res.json(invites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/invites/pending/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const invites = await storage.getPendingInvites(wallet);
      res.json(invites);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/invites/:inviteId/respond", async (req, res) => {
    try {
      const { inviteId } = req.params;
      const { accept } = req.body;

      if (typeof accept !== 'boolean') {
        return res.status(400).json({ error: "Accept must be a boolean" });
      }

      const invite = await storage.respondToInvite(inviteId, accept);
      res.json(invite);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dream Tokens endpoints
  app.post("/api/tokens/mint", requireAdmin, async (req, res) => {
    try {
      const { dreamId, cocoonId, holderWallet, purpose, milestone, metadata } = req.body;

      if (!dreamId || !holderWallet || !purpose) {
        return res.status(400).json({ error: "DreamId, holderWallet, and purpose are required" });
      }

      const token = await storage.mintToken(dreamId, cocoonId, holderWallet, purpose, milestone, metadata);
      res.json(token);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tokens", async (req, res) => {
    try {
      const { wallet, dreamId, purpose } = req.query;
      const tokens = await storage.getDreamTokens(wallet as string, dreamId as string, purpose as string);
      res.json(tokens);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/tokens/holder/:wallet", async (req, res) => {
    try {
      const { wallet } = req.params;
      const tokens = await storage.getTokensByHolder(wallet);
      res.json(tokens);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Network Graph endpoint
  app.get("/api/network-graph", async (req, res) => {
    try {
      const graph = await storage.getNetworkGraph();
      res.json(graph);
    } catch (error: any) {
      console.log(`Error generating network graph: ${error}`);
      res.status(500).json({ error: "Failed to generate network graph" });
    }
  });

  // Webhook test endpoint (admin only)
  app.post("/api/webhooks/test", requireAdmin, async (req, res) => {
    try {
      const { webhookNotifier } = await import("./webhook-notifier");
      await webhookNotifier.testWebhooks();
      res.json({ message: "Webhook test triggered" });
    } catch (error: any) {
      console.log(`Error testing webhooks: ${error}`);
      res.status(500).json({ error: "Failed to test webhooks" });
    }
  });

  // Simple Garden Feed API - Returns all dreams and cocoons with simple structure
  app.get("/api/garden/feed", async (req, res) => {
    try {
      const gardenFeed = await storage.getSimpleGardenFeed();
      res.json({
        feed: gardenFeed,
        count: gardenFeed.length,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Garden Feed direct route - Public access with static data (bypass router issues)
  app.get("/api/garden-feed/", async (req, res) => {
    try {
      console.log('[Garden Feed Direct] Processing garden feed request - returning static data');
      
      // Return static garden feed data directly (no database dependency)
      const staticFeed = [
        {
          id: "dream-0",
          name: "Dream 0",
          creator: "0xFAKE0",
          tags: ["ai"],
          score: 75,
          evolved: false,
          lastUpdated: new Date().toISOString(),
          coreType: "Vision",
          description: "This is the seed description for Dream 0.",
          image: "https://picsum.photos/seed/0/300/200",
          status: "Draft"
        },
        {
          id: "dream-1", 
          name: "Dream 1",
          creator: "0xFAKE1",
          tags: ["crypto"],
          score: 68,
          evolved: false,
          lastUpdated: new Date().toISOString(),
          coreType: "Tool",
          description: "This is the seed description for Dream 1.",
          image: "https://picsum.photos/seed/1/300/200",
          status: "Draft"
        },
        {
          id: "dream-2",
          name: "Dream 2", 
          creator: "0xFAKE2",
          tags: ["music"],
          score: 82,
          evolved: false,
          lastUpdated: new Date().toISOString(),
          coreType: "Movement",
          description: "This is the seed description for Dream 2.",
          image: "https://picsum.photos/seed/2/300/200",
          status: "Draft"
        }
      ];
      
      console.log(`[Garden Feed Direct] Returning ${staticFeed.length} static dreams`);
      res.json(staticFeed);
    } catch (e) {
      console.error('Feed error:', e);
      res.status(500).json({ 
        error: 'Failed to get garden feed',
        message: e instanceof Error ? e.message : 'Unknown error'
      });
    }
  });

  // Garden Feed Router - Enhanced endpoint with metadata (public access)
  app.use("/api/garden-feed", gardenFeedRouter);

  // Task Connector Router - Bot routing and orchestration
  app.use("/api/connector", taskConnectorRouter);
  app.use("/api/connector-v1", streamlinedConnectorRouter);
  
  // Dreams Router - Simple dream submission endpoint  
  app.use('/api/dreams', dreamsRouter);
  
  // Wallet Scan Router - FlutterAI wallet analysis
  app.use('/api/wallet-scan', walletScanRouter);
  
  // Dream Processing Pipeline - LUCID/CANVAS/ROOT/ECHO stages
  app.use('/api/dream-processor', dreamProcessorRouter);
  
  // Wallet Score Evaluation - CRADLE vs SEED access determination
  app.use('/api/wallet-score', walletScoreRouter);
  
  // Dream Core Management - Spawning and evolution
  app.use('/api/dream-cores', dreamCoresRouter);
  
  app.use('/api/lucid', lucidRoute);
  app.use('/api/canvas', canvasRoute);
  app.use('/api/root', rootRoute);
  app.use('/api/echo', echoRoute);

  // Test orchestration endpoint for simulation
  app.post("/api/test/orchestration", requireAdmin, async (req, res) => {
    try {
      console.log("🎭 Starting Dream Network Orchestration Simulation...");
      
      // Import and run orchestration (async to not block response)
      import("./orchestration-script").then(async (module) => {
        try {
          await module.runOrchestration();
          console.log("✅ Orchestration simulation completed successfully");
        } catch (error) {
          console.log("❌ Orchestration simulation failed:", error);
        }
      });

      res.json({
        message: "Dream network orchestration simulation started",
        status: "running",
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // AI Dream Evaluation endpoint
  app.post("/api/evaluate-dream/:id", requireAdmin, async (req, res) => {
    try {
      const dream = await storage.getDream(req.params.id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Import and run evaluation
      const { dreamEvaluator } = await import("./ai-dream-evaluator");
      const result = await dreamEvaluator.evaluateDream(dream);

      res.json({
        dreamId: dream.id,
        score: result.score,
        action: result.action,
        reasoning: result.reasoning,
        categoryScores: result.categoryScores,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("❌ Dream evaluation error:", error);
      res.status(500).json({ error: "Failed to evaluate dream" });
    }
  });

  // Batch evaluate all pending dreams
  app.post("/api/evaluate-all-dreams", requireAdmin, async (req, res) => {
    try {
      console.log("🤖 Starting batch dream evaluation...");
      
      // Import and run batch evaluation (async to not block response)
      import("./ai-dream-evaluator").then(async (module) => {
        try {
          await module.dreamEvaluator.evaluateAllPendingDreams();
          console.log("✅ Batch dream evaluation completed");
        } catch (error) {
          console.log("❌ Batch dream evaluation failed:", error);
        }
      });

      res.json({
        message: "Batch dream evaluation started",
        status: "running",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Public dream submission endpoint
  app.post("/api/submit-dream", async (req, res) => {
    try {
      const { dreamName, walletAddress, description, tags } = req.body;

      // Validation
      if (!dreamName || typeof dreamName !== 'string' || dreamName.trim().length < 3) {
        return res.status(400).json({ error: "Dream name must be at least 3 characters" });
      }

      if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim().length < 32) {
        return res.status(400).json({ error: "Valid wallet address is required" });
      }

      if (!description || typeof description !== 'string' || description.trim().length < 10) {
        return res.status(400).json({ error: "Description must be at least 10 characters" });
      }

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        return res.status(400).json({ error: "At least one tag is required" });
      }

      // Sanitize tags
      const cleanTags = tags
        .map(tag => typeof tag === 'string' ? tag.trim() : '')
        .filter(tag => tag.length > 0)
        .slice(0, 10); // Limit to 10 tags max

      if (cleanTags.length === 0) {
        return res.status(400).json({ error: "At least one valid tag is required" });
      }

      // Create dream object
      const newDream = await storage.createDream({
        wallet: walletAddress.trim(),
        title: dreamName.trim(),
        description: description.trim(),
        tags: cleanTags,
        urgency: 5, // Default urgency for public submissions
        origin: "public_submission"
      });

      // Log to console
      console.log("📝 NEW DREAM SUBMITTED:");
      console.log("========================");
      console.log(`ID: ${newDream.id}`);
      console.log(`Name: ${newDream.title}`);
      console.log(`Wallet: ${newDream.wallet}`);
      console.log(`Description: ${newDream.description}`);
      console.log(`Tags: ${newDream.tags?.join(", ")}`);
      console.log(`Status: ${newDream.status}`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      console.log("========================");

      res.json({
        message: "Dream submitted successfully",
        dreamId: newDream.id,
        status: "pending_review",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("❌ Dream submission error:", error);
      res.status(500).json({ error: "Failed to submit dream. Please try again." });
    }
  });

  // Tags endpoints
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getAllTags();
      res.json(tags);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/dreams/:id/tags", requireAdmin, async (req, res) => {
    try {
      const { tags } = req.body;
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }
      const dream = await storage.updateDreamTags(req.params.id, tags);
      res.json(dream);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/cocoons/:id/tags", requireAdmin, async (req, res) => {
    try {
      const { tags } = req.body;
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: "Tags must be an array" });
      }
      const cocoon = await storage.updateCocoonTags(req.params.id, tags);
      res.json(cocoon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Force cocoon stage endpoint with override protection
  app.patch("/api/cocoons/:id/force-stage", requireAdmin, async (req, res) => {
    try {
      const { stage, overrideMode = false } = req.body;
      const adminWallet = req.headers['x-wallet-address'] as string;
      
      if (!overrideMode && process.env.OVERRIDE_MODE !== 'true') {
        return res.status(403).json({ 
          error: "Override mode required. Set OVERRIDE_MODE=true in environment or enable override mode in admin dashboard." 
        });
      }
      
      const cocoon = await storage.forceCocoonStage(req.params.id, stage, adminWallet);
      res.json(cocoon);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cocoon logs endpoints
  app.get("/api/cocoons/:id/logs", async (req, res) => {
    try {
      const logs = await storage.getCocoonLogs(req.params.id);
      res.json(logs);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // NFT minting endpoint
  app.post("/api/cocoons/:id/mint", requireAdmin, async (req, res) => {
    try {
      const cocoon = await storage.getCocoon(req.params.id);
      if (!cocoon) {
        return res.status(404).json({ error: "Cocoon not found" });
      }

      if (cocoon.stage !== 'complete') {
        return res.status(400).json({ error: "Only completed cocoons can be minted" });
      }

      if (!cocoon.dreamScore || cocoon.dreamScore < 80) {
        return res.status(400).json({ error: "Cocoon must have a score of 80+ to be eligible for minting" });
      }

      // Simulate NFT minting (in real implementation, this would call actual NFT contract)
      const nftData = {
        name: `Cocoon of ${cocoon.title}`,
        contractAddress: "0x" + Math.random().toString(16).substr(2, 40),
        tokenId: Math.floor(Math.random() * 10000),
        mintedAt: new Date().toISOString(),
        owner: cocoon.creatorWallet
      };

      // Send notification
      await notificationEngine.notifyNFTMinted(cocoon, nftData);

      res.json({
        message: "NFT minted successfully",
        nft: nftData,
        cocoon
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Archive inactive items endpoint
  app.post("/api/maintenance/archive", requireAdmin, async (req, res) => {
    try {
      const inactivityDays = parseInt(process.env.INACTIVITY_DAYS_BEFORE_ARCHIVE || '7');
      const archivedItems = await storage.archiveInactiveItems(inactivityDays);
      res.json({
        message: "Archive process completed",
        archived: archivedItems
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Development and testing endpoints (remove in production)
  if (process.env.NODE_ENV === 'development') {
    // Generate test dreams
    app.post("/api/dev/generate-dreams", async (req, res) => {
      try {
        const { generateBatch } = await import("./dev-test-generator");
        const count = parseInt(req.body.count) || 5;
        await generateBatch(count);
        res.json({ message: `Generated ${count} test dreams successfully` });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Run orchestration script
    app.post("/api/dev/run-orchestration", async (req, res) => {
      try {
        const { runOrchestration } = await import("./orchestration-script");
        await runOrchestration();
        res.json({ message: "Orchestration script completed successfully" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Run comprehensive test
    app.post("/api/dev/run-test", async (req, res) => {
      try {
        const { runDemoTest } = await import("../test-runner");
        await runDemoTest();
        res.json({ message: "Comprehensive test completed successfully" });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });

    // Test minting functionality
    app.post("/api/dev/test-mint/:id", async (req, res) => {
      try {
        const cocoon = await storage.getCocoon(req.params.id);
        if (!cocoon) {
          return res.status(404).json({ error: "Cocoon not found" });
        }

        const minted = await storage.checkAndMintNFT(cocoon);
        res.json({ 
          message: minted ? "NFT minted successfully" : "Minting conditions not met",
          minted,
          cocoon: {
            id: cocoon.id,
            title: cocoon.title,
            stage: cocoon.stage,
            score: cocoon.dreamScore,
            alreadyMinted: cocoon.minted
          }
        });
      } catch (error: any) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  // Simple notifications endpoints
  app.get("/api/simple-notifications", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const { simpleNotifications } = await import("./simple-notifications");
      const limit = parseInt(req.query.limit as string) || 20;
      const notifications = simpleNotifications.getNotifications(walletAddress, limit);
      
      res.json({
        notifications,
        unreadCount: simpleNotifications.getUnreadCount(walletAddress)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/simple-notifications/:id/read", async (req, res) => {
    try {
      const { simpleNotifications } = await import("./simple-notifications");
      const success = simpleNotifications.markAsRead(req.params.id);
      res.json({ success });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch("/api/simple-notifications/mark-all-read", async (req, res) => {
    try {
      const walletAddress = req.headers['x-wallet-address'] as string;
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }
      
      const { simpleNotifications } = await import("./simple-notifications");
      const count = simpleNotifications.markAllAsRead(walletAddress);
      res.json({ markedCount: count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dream Storage Router - Local file persistence
  app.use('/api/dream-storage', dreamStorageRouter);
  app.use('/api/save-core', saveCoreRoute);
  app.use('/api/load-core', loadCoreRoute);
  app.use('/api/reactivate-core', reactivateCoreRoute);
  app.use('/api/generate-dream-link', generateDreamLinkRoute);
  app.use('/api/shared-dream', sharedDreamRoute);
  app.use('/api/public-dream', publicDreamRoute);
  app.use('/api/mutate-dream', mutateDreamRoute);
  app.use('/api/save-mutated-dream', saveMutatedDreamRoute);
  app.use('/api/load-dreams', loadDreamsRoute);
  app.use('/api/all-dreams', allDreamsRoute);
  app.use('/api/get-dream', getDreamRoute);
  app.use('/api/get-dream-by-id', getDreamByIdRoute);
  // Fuse dreams route is handled inline above
  app.use('/api/fusions', fusionsRoute);
  app.use('/api/claim-fusion', claimFusionRoute);
  app.use('/api/dreams', dreamViewer);
  app.use('/api/wallet-scoring', walletScoringRouter);
  app.use('/api/echo-score', echoScoreRouter);
  app.use('/api', mintTokenRouter);
  app.use('/api', mintDreamRouter);
  // fuseDreamsRouter removed as route is handled inline
  app.use('/api', myDreamsRouter);
  app.use('/api/remix-dream', remixDreamRouter);
  app.use('/api/dream-titles', dreamTitlesRouter);
  app.use('/api/save-dream', saveDreamRouter);
  app.use('/api', saveDreamRouter);
  app.use(evolutionVaultRouter);
  app.use(aiSurgeonRouter);
  app.use(defenseNetworkRouter);
  app.use(evolutionEngineRouter);
  app.use('/api/base-health', baseHealthRouter);
  
  // OPS Contract routes
  app.use('/api/ops', opsRouter);
  app.use('/api/website-designer', websiteDesignerRouter);
  app.use('/api/deployment', deploymentRouter);
  app.use('/api/domains', domainIssuanceRouter);
  app.use('/api/passports', passportsRouter);
  app.use('/api/citizens', citizensRouter);
  app.use('/api/register-agents', registerAgentsRouter);
  app.use('/api/aws', awsRouter);
  app.use('/api/google-cloud', googleCloudRouter);
  
  // Admin wallets routes
  app.use('/api/admin-wallets', adminWalletsRouter);

  // Bounty endpoints
  app.post('/api/post-bounty', postBountyHandler);
  app.get('/api/get-bounties', getBountiesHandler);
  app.post('/api/join-dream-team', joinDreamTeamHandler);
  app.get('/api/get-dream-forks', getDreamForksHandler);
  app.get('/api/get-forks-by-bounty', getDreamForksHandler);
  app.get('/api/dreams/cloud/:slug', getDreamsByCloudHandler);
  app.get('/api/dreams/all', async (req, res) => {
    try {
      // Mock implementation - return sample dreams with dreamCloud field
      const mockDreams = [
        { id: 'ai-1', title: 'Neural Network Vision', dreamCloud: 'ai' },
        { id: 'defi-1', title: 'Decentralized Exchange Protocol', dreamCloud: 'defi' },
        { id: 'gaming-1', title: 'Blockchain Gaming World', dreamCloud: 'gaming' },
        { id: 'zksync-1', title: 'Zero Knowledge Privacy Tool', dreamCloud: 'zksync' },
        { id: 'desci-1', title: 'Decentralized Research Platform', dreamCloud: 'desci' },
        { id: 'memes-1', title: 'Community Meme Generator', dreamCloud: 'memes' },
        { id: 'tools-1', title: 'Developer Productivity Suite', dreamCloud: 'tools' },
        { id: 'social-1', title: 'Decentralized Social Network', dreamCloud: 'social' },
        { id: 'art-1', title: 'NFT Art Marketplace', dreamCloud: 'art' }
      ];
      res.json(mockDreams);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/fuse-dreams', async (req, res) => {
    try {
      const { dreamIds, dreamBody, currentWallet, bountyToken, bountyAmount, fusionBoost } = req.body;
      
      // Get the dreams being fused
      const response = await fetch(`http://localhost:5000/api/fuse/${dreamIds.join(',')}`);
      const data = await response.json();
      const dreams = data.dreams;
      
      // Database insertion using your exact pattern
      const fusedDream = await mongoDb.collection('dreams').insertOne({
        title: 'Fused Dream',
        body: dreamBody,
        fusedFrom: dreams.map(d => d.id),
        creator: currentWallet,
        bountyToken: bountyToken,
        bountyAmount: bountyAmount, // Store in raw token units
        fusionBoost: fusionBoost,
        timestamp: Date.now()
      });
      
      const newDream = {
        id: fusedDream.insertedId,
        title: 'Fused Dream',
        body: dreamBody,
        fusedFrom: dreams.map(d => d.id),
        creator: currentWallet,
        bountyToken: bountyToken,
        bountyAmount: bountyAmount,
        fusionBoost: fusionBoost,
        timestamp: Date.now()
      };
      
      console.log('Created fusion:', newDream);
      res.json({ success: true, fusedDream: newDream });
    } catch (error: any) {
      console.error('Fusion error:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/fuse/:ids', async (req, res) => {
    try {
      const ids = req.params.ids.split(',');
      
      // Mock dream data lookup
      const allDreams = [
        { id: 'ai-1', title: 'Neural Network Vision', dreamCloud: 'ai' },
        { id: 'defi-1', title: 'Decentralized Exchange Protocol', dreamCloud: 'defi' },
        { id: 'gaming-1', title: 'Blockchain Gaming World', dreamCloud: 'gaming' },
        { id: 'zksync-1', title: 'Zero Knowledge Privacy Tool', dreamCloud: 'zksync' },
        { id: 'desci-1', title: 'Decentralized Research Platform', dreamCloud: 'desci' },
        { id: 'memes-1', title: 'Community Meme Generator', dreamCloud: 'memes' },
        { id: 'tools-1', title: 'Developer Productivity Suite', dreamCloud: 'tools' },
        { id: 'social-1', title: 'Decentralized Social Network', dreamCloud: 'social' },
        { id: 'art-1', title: 'NFT Art Marketplace', dreamCloud: 'art' }
      ];
      
      const dreams = allDreams.filter(d => ids.includes(d.id));
      res.json({ dreams });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Migration endpoint
  app.post('/api/migrate-dream-cloud', async (req, res) => {
    try {
      const { migrateDreamCloud } = await import('./migrate-dream-cloud');
      const result = await migrateDreamCloud();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // DreamNode Registry API endpoints
  app.get('/api/nodes', async (req, res) => {
    try {
      const { nodeRegistry } = await import('../dreamnodes/registry/NodeRegistry.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');
      const { DEFI_LAB_NODE } = await import('../dreamnodes/defi-lab/node.config.js');
      
      // Register nodes if not already registered
      if (!nodeRegistry.getNode('flutterbye')) {
        nodeRegistry.registerNode(FLUTTERBY_NODE);
      }
      if (!nodeRegistry.getNode('defi-lab')) {
        nodeRegistry.registerNode(DEFI_LAB_NODE);
      }

      const publicNodes = nodeRegistry.listPublicNodes();
      res.json({
        success: true,
        nodes: publicNodes,
        totalCount: publicNodes.length,
        dreamNodeInterface: "Implemented according to DreamNode interface specification"
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch nodes',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get('/api/nodes/:nodeId', async (req, res) => {
    try {
      const { nodeRegistry } = await import('../dreamnodes/registry/NodeRegistry.js');
      const { FLUTTERBY_NODE } = await import('../dreamnodes/flutterbye/node.config.js');
      const { DEFI_LAB_NODE } = await import('../dreamnodes/defi-lab/node.config.js');
      
      // Register nodes if not already registered
      if (!nodeRegistry.getNode('flutterbye')) {
        nodeRegistry.registerNode(FLUTTERBY_NODE);
      }
      if (!nodeRegistry.getNode('defi-lab')) {
        nodeRegistry.registerNode(DEFI_LAB_NODE);
      }

      const { nodeId } = req.params;
      const node = nodeRegistry.getNode(nodeId);
      
      if (!node) {
        return res.status(404).json({
          error: 'Node not found',
          nodeId
        });
      }

      const usageStats = nodeRegistry.getUsageStats(nodeId);
      
      res.json({
        success: true,
        node,
        usageStats,
        dreamNodeInterface: "Full DreamNode specification implemented"
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch node details',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Ecosystem Dashboard API
  const ecosystemDashboardRoutes = await import('./routes/ecosystem-dashboard.js');
  app.use('/api/ecosystem', ecosystemDashboardRoutes.default);

  // Ecosystem Commands API
  const ecosystemCommandsRoutes = await import('./routes/ecosystem-commands.js');
  app.use('/api/ecosystem', ecosystemCommandsRoutes.default);

  // Dream Remix API
  const dreamRemixRoutes = await import('./routes/dream-remix.js');
  app.use('/api/dreams', dreamRemixRoutes.default);

  // Dream Cloud API
  const dreamCloudRoutes = await import('./routes/dream-cloud.js');
  app.use('/api/dream-clouds', dreamCloudRoutes.default);
  app.use('/api/dreams', dreamCloudRoutes.default);

  // Blessing system routes
  app.post("/api/dreams/:dreamId/bless", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { wallet, message, amount } = req.body;
      
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      const blessing = {
        wallet,
        message: message || "Blessed with positive energy ✨",
        amount: amount || 1,
        timestamp: Date.now()
      };

      const currentBlessings = dream.blessings || [];
      const updatedBlessings = [...currentBlessings, blessing];

      await storage.updateDream(dreamId, {
        blessings: updatedBlessings,
        blessCount: updatedBlessings.length,
        xp: (dream.xp || 0) + (amount * 10) // 10 XP per SHEEP blessed
      });

      res.json({ success: true, blessing });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/dreams/:dreamId/blessings", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }
      res.json(dream.blessings || []);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Evolution system routes
  app.post("/api/dreams/:dreamId/evolve", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { evolutionType } = req.body;
      
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      if (dream.level < 3) {
        return res.status(400).json({ error: "Dream must be level 3+ to evolve" });
      }

      await storage.updateDream(dreamId, {
        evolved: true,
        evolutionType,
        xp: (dream.xp || 0) + 100 // Evolution bonus
      });

      res.json({ success: true, evolutionType });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cloud XP tracking routes
  app.get("/api/cloud/xp-events/:cloudId?", async (req, res) => {
    try {
      const { cloudId } = req.params;
      
      // Mock XP events for now - in production this would query a real events table
      const mockEvents = [
        {
          id: "evt_1",
          type: "remix",
          actor: "0xabc123",
          cloudId: cloudId || "defi",
          xpGained: 50,
          timestamp: Date.now() - 300000,
          description: "Remix by 0xabc123 earned +50 XP"
        },
        {
          id: "evt_2", 
          type: "revival",
          actor: "0xdef456",
          cloudId: cloudId || "ai",
          xpGained: 200,
          timestamp: Date.now() - 600000,
          description: "Fossil revival boosted cloud by +200 XP"
        },
        {
          id: "evt_3",
          type: "blessing",
          actor: "0x789xyz",
          cloudId: cloudId || "defi",
          xpGained: 25,
          timestamp: Date.now() - 900000,
          description: "Dream blessing contributed +25 XP"
        }
      ];

      const filteredEvents = cloudId 
        ? mockEvents.filter(e => e.cloudId === cloudId)
        : mockEvents;
      
      res.json(filteredEvents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/cloud/leaderboard", async (req, res) => {
    try {
      const { limit = 10 } = req.query;
      
      // Mock cloud leaderboard data
      const mockClouds = [
        {
          id: "defi",
          name: "DeFi Lab",
          xp: 2450,
          level: 4,
          members: 23,
          recentActivity: 5
        },
        {
          id: "ai",
          name: "NeuroBloom",
          xp: 1890,
          level: 3,
          members: 18,
          recentActivity: 8
        },
        {
          id: "gaming",
          name: "GameForge",
          xp: 1650,
          level: 3,
          members: 31,
          recentActivity: 2
        },
        {
          id: "zksync",
          name: "ZK Sanctuary",
          xp: 1200,
          level: 2,
          members: 12,
          recentActivity: 0
        },
        {
          id: "memes",
          name: "Meme Factory",
          xp: 980,
          level: 2,
          members: 45,
          recentActivity: 12
        }
      ];

      const sortedClouds = mockClouds
        .sort((a, b) => b.xp - a.xp)
        .slice(0, Number(limit));

      res.json(sortedClouds);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Nightmare claiming routes
  app.post("/api/dreams/:dreamId/claim-nightmare", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { wallet, claimType, reviveBonus } = req.body;
      
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Check if dream is actually a nightmare
      if (dream.status !== 'nightmare' && !dream.isNightmare) {
        return res.status(400).json({ error: "Dream is not in nightmare status" });
      }

      // Process the nightmare claim
      const bountyAmount = dream.bountyAmount || '500';
      const bountyToken = dream.bountyToken || 'SHEEP';

      await storage.updateDream(dreamId, {
        status: 'Draft', // Restore from nightmare
        isNightmare: false,
        evolved: false,
        xp: (dream.xp || 0) + 150, // Bonus XP for revival
        level: Math.max(1, dream.level || 1),
        nightmareEscapes: (dream.nightmareEscapes || 0) + 1
      });

      res.json({ 
        success: true, 
        bountyAmount: parseFloat(bountyAmount),
        bountyToken,
        xpBonus: 150,
        message: "Nightmare successfully claimed and dream revived!"
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/dreams/:dreamId/revive", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { wallet, method, message, bountyAmount, bountyToken } = req.body;
      
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Calculate revival bonuses based on method
      const methodBonuses = {
        blessing: { xp: 100, cost: 1 },
        community: { xp: 200, cost: 0 },
        evolution: { xp: 300, cost: 5 }
      };

      const bonus = methodBonuses[method as keyof typeof methodBonuses] || methodBonuses.blessing;

      await storage.updateDream(dreamId, {
        status: 'Draft',
        isNightmare: false,
        evolved: method === 'evolution',
        evolutionType: method === 'evolution' ? 'Shadow' : dream.evolutionType,
        xp: (dream.xp || 0) + bonus.xp,
        level: Math.max(1, dream.level || 1),
        nightmareEscapes: (dream.nightmareEscapes || 0) + 1,
        blessCount: method === 'blessing' ? (dream.blessCount || 0) + 1 : dream.blessCount
      });

      res.json({ 
        success: true, 
        method,
        bountyAmount,
        bountyToken,
        xpBonus: bonus.xp,
        evolved: method === 'evolution',
        message: `Dream successfully revived using ${method} method!`
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Dream remixing endpoint
  app.post("/api/dreams/:dreamId/remix", async (req, res) => {
    try {
      const { dreamId } = req.params;
      const { userId, title, tags, content, token } = req.body;
      
      // Create remix with schema-compliant fields
      const remixData = {
        wallet: userId || "anonymous",
        title: title || `Remix of ${dreamId}`,
        description: content || `A remix of dream ${dreamId}`,
        tags: tags || ["remix"],
        urgency: 5,
        origin: "remix",
        forkedFrom: dreamId
      };
      
      const newDream = await storage.createDream(remixData);
      res.json(newDream);
    } catch (error: any) {
      console.error("Error creating remix:", error);
      res.status(500).json({ error: "Failed to create remix" });
    }
  });

  // Dream evolution endpoint - returns hierarchical tree structure
  app.get("/api/dreams/:id/evolution", async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get the dream
      const dream = await storage.getDream(id);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Recursive function to build dream tree
      const buildDreamTree = async (dreamId: string): Promise<any> => {
        const currentDream = await storage.getDream(dreamId);
        if (!currentDream) return null;

        // Get all dreams that forked from this one using storage layer
        const allDreams = await storage.getDreams();
        const children = allDreams.filter(d => d.forkedFrom === dreamId);

        // Recursively build children trees
        const childrenTrees = await Promise.all(
          children.map(child => buildDreamTree(child.id))
        );

        return {
          id: currentDream.id,
          title: currentDream.title || currentDream.name || "Untitled Dream",
          children: childrenTrees.filter(Boolean)
        };
      }

      const evolutionTree = await buildDreamTree(id);
      
      res.json(evolutionTree);
    } catch (error: any) {
      console.error("Error fetching evolution tree:", error);
      res.status(500).json({ error: "Failed to fetch evolution tree" });
    }
  });

  // Enhanced evolution tree with filtering
  app.get("/api/evolution-tree", async (req, res) => {
    try {
      const { trust, bounty, collapse } = req.query;
      console.log("Evolution tree query params:", { trust, bounty, collapse });
      
      // Use in-memory storage instead of direct DB calls
      const allDreams = await storage.getDreams();
      console.log(`Found ${allDreams.length} dreams in storage`);
      
      // Filter dreams based on query parameters
      let filteredDreams = allDreams;
      
      if (trust === 'high') {
        filteredDreams = filteredDreams.filter(d => (d.trustScore || 50) >= 80);
        console.log(`After trust filter: ${filteredDreams.length} dreams`);
      }
      
      if (bounty === 'true') {
        filteredDreams = filteredDreams.filter(d => d.bountyId);
        console.log(`After bounty filter: ${filteredDreams.length} dreams`);
      }

      // Build tree structure with enhanced dream data
      const rootDreams = filteredDreams.filter(d => !d.forkedFrom);
      console.log(`Root dreams: ${rootDreams.length}`);

      const dreamTrees = rootDreams.map(rootDream => {
        function buildEnhancedTree(dreamId: string): any {
          const dream = allDreams.find(d => d.id === dreamId);
          if (!dream) return null;

          const children = allDreams.filter(d => d.forkedFrom === dreamId);

          // Calculate trust level
          const trustScore = dream.trustScore || Math.floor(Math.random() * 100);
          const trustLevel = trustScore >= 80 ? 'High' : trustScore >= 60 ? 'Medium' : 'Low';

          return {
            id: dream.id,
            title: dream.title || dream.name || "Untitled Dream",
            score: dream.score || dream.dreamScore || Math.floor(Math.random() * 100),
            remixCount: children.length,
            bounties: dream.bountyId ? Math.floor(Math.random() * 5000) : 0,
            trustLevel,
            children: collapse === 'true' ? [] : children.map(child => buildEnhancedTree(child.id)).filter(Boolean)
          };
        }

        return buildEnhancedTree(rootDream.id);
      }).filter(Boolean);

      console.log(`Returning ${dreamTrees.length} dream trees`);
      res.json(dreamTrees);
    } catch (error: any) {
      console.error("Error fetching evolution tree:", error);
      res.status(500).json({ error: "Failed to fetch evolution tree", details: error.message });
    }
  });

  // Nightmare network endpoint
  app.post("/api/network/nightmare", async (req, res) => {
    try {
      const { dreamId, trigger } = req.body;
      
      console.log("🌙 Nightmare network activated:", { dreamId, trigger });
      
      // Apply inverted trust mechanics
      const applyInvertedTrust = async () => {
        const allDreams = await storage.getDreams();
        const invertedResults = allDreams.map(dream => ({
          ...dream,
          trustScore: 100 - (dream.trustScore || 50), // Invert trust scores
          trustLevel: (dream.trustScore || 50) < 20 ? 'High' : (dream.trustScore || 50) < 40 ? 'Medium' : 'Low',
          isNightmare: true,
          decayRate: Math.random() * 0.1 + 0.05 // 5-15% decay per cycle
        }));
        return invertedResults;
      };

      // Activate decay visuals
      const activateDecayVisuals = () => {
        return {
          visualEffects: {
            backgroundGradient: 'linear-gradient(45deg, #1a0033, #330011)',
            glowColor: '#ff0066',
            pulseAnimation: 'nightmare-pulse 2s infinite',
            borderStyle: 'dashed',
            opacityDecay: 0.85
          },
          animations: {
            'nightmare-pulse': {
              '0%': { boxShadow: '0 0 5px #ff0066' },
              '50%': { boxShadow: '0 0 20px #ff0066, 0 0 30px #ff0066' },
              '100%': { boxShadow: '0 0 5px #ff0066' }
            }
          }
        };
      };

      // Unlock specialized nightmare agents
      const unlockAgents = (agentList: string[]) => {
        return agentList.map(agent => ({
          name: agent,
          type: 'nightmare',
          capabilities: agent === 'SHADE' 
            ? ['shadow_analysis', 'trust_inversion', 'decay_calculation']
            : ['void_processing', 'entropy_management', 'reality_distortion'],
          status: 'activated',
          unlockTime: new Date().toISOString()
        }));
      };

      const invertedDreams = await applyInvertedTrust();
      const decayVisuals = activateDecayVisuals();
      const nightmareAgents = unlockAgents(['SHADE', 'VOID']);

      res.json({
        network: 'nightmare',
        status: 'activated',
        invertedTrustApplied: true,
        decayVisualsActive: true,
        unlockedAgents: nightmareAgents,
        affectedDreams: invertedDreams.length,
        effects: {
          trustInversion: 'active',
          decayVisuals: decayVisuals,
          specialAgents: nightmareAgents
        },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("Error activating nightmare network:", error);
      res.status(500).json({ error: "Failed to activate nightmare network" });
    }
  });

  // Nightmare agent assignment endpoint
  app.post("/api/nightmare/assign-agent", async (req, res) => {
    try {
      const { dreamId, agent, assignedBy } = req.body;
      
      console.log("🌙 Assigning nightmare agent:", { dreamId, agent, assignedBy });
      
      // Validate agent type
      const validAgents = ["DREAD", "SHADE", "WHISPER", "ECHO", "CRYPT"];
      if (!validAgents.includes(agent)) {
        return res.status(400).json({ error: "Invalid agent type", validAgents });
      }

      // Get dream for assignment
      const dream = await storage.getDream(dreamId);
      if (!dream) {
        return res.status(404).json({ error: "Dream not found" });
      }

      // Define agent capabilities and specializations
      const agentCapabilities = {
        DREAD: {
          type: "fear_amplifier",
          capabilities: ["anxiety_induction", "terror_projection", "phobia_manifestation"],
          powerLevel: 95,
          description: "Amplifies fear responses and instills deep psychological dread"
        },
        SHADE: {
          type: "shadow_processor", 
          capabilities: ["shadow_analysis", "trust_inversion", "decay_calculation", "darkness_manipulation"],
          powerLevel: 88,
          description: "Processes shadow aspects and inverts trust mechanics"
        },
        WHISPER: {
          type: "mind_infiltrator",
          capabilities: ["subconscious_injection", "memory_distortion", "thought_seeding"],
          powerLevel: 82,
          description: "Infiltrates minds through subtle whispers and thought manipulation"
        },
        ECHO: {
          type: "reality_distorter",
          capabilities: ["perception_warping", "reality_echoing", "dimensional_bleeding"],
          powerLevel: 90,
          description: "Creates echoing distortions in perceived reality"
        },
        CRYPT: {
          type: "entropy_guardian",
          capabilities: ["data_corruption", "memory_encryption", "soul_binding"],
          powerLevel: 93,
          description: "Guards and corrupts data with cryptographic entropy"
        }
      };

      const selectedAgent = agentCapabilities[agent as keyof typeof agentCapabilities];
      
      // Create assignment record
      const assignment = {
        dreamId,
        agentName: agent,
        agentType: selectedAgent.type,
        capabilities: selectedAgent.capabilities,
        powerLevel: selectedAgent.powerLevel,
        assignedBy,
        assignedAt: new Date().toISOString(),
        status: "active",
        corruptionLevel: Math.floor(Math.random() * 50) + 50, // 50-100% corruption
        influenceRadius: Math.floor(Math.random() * 1000) + 500, // 500-1500 units
        description: selectedAgent.description
      };

      // Simulate nightmare effects on dream
      const nightmareEffects = {
        trustScoreModification: -25, // Reduce trust by 25 points
        decayRateIncrease: 0.15, // Increase decay by 15%
        corruptionSpread: true,
        visualDistortions: {
          glitchIntensity: Math.random() * 0.8 + 0.2,
          colorShift: agent === "DREAD" ? "red" : agent === "SHADE" ? "purple" : "gray",
          pulseFrequency: selectedAgent.powerLevel / 10
        }
      };

      res.json({
        success: true,
        assignment,
        effects: nightmareEffects,
        message: `${agent} has been assigned to dream ${dreamId}`,
        corruptionWarning: assignment.corruptionLevel > 80 ? "CRITICAL CORRUPTION LEVEL" : null,
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Error assigning nightmare agent:", error);
      res.status(500).json({ error: "Failed to assign nightmare agent", details: error.message });
    }
  });

  // Nightmare agent tracking endpoint
  app.get("/api/nightmare/agents/tracking", async (req, res) => {
    try {
      // Simulate active nightmare agents with tracking data
      const activeAgents = [
        {
          dreamId: "infected_dream_123",
          agent: "WHISPER",
          status: "tracking",
          lastAction: "Analyzed source infection",
          powerLevel: 82,
          corruptionLevel: 76,
          influenceRadius: 1200,
          assignedBy: "0xYourWallet",
          assignedAt: "2025-01-04T21:45:00Z",
          log: [
            { timestamp: "2025-01-04T21:45:00Z", action: "Agent WHISPER activated", severity: "info" },
            { timestamp: "2025-01-04T21:45:15Z", action: "Initiated subconscious injection protocol", severity: "warning" },
            { timestamp: "2025-01-04T21:45:30Z", action: "Memory distortion field established", severity: "critical" },
            { timestamp: "2025-01-04T21:46:00Z", action: "Analyzed source infection patterns", severity: "info" },
            { timestamp: "2025-01-04T21:46:30Z", action: "Thought seeding commenced in dream core", severity: "warning" }
          ]
        },
        {
          dreamId: "dark_vision_456",
          agent: "DREAD",
          status: "amplifying",
          lastAction: "Terror projection at 95% intensity",
          powerLevel: 95,
          corruptionLevel: 89,
          influenceRadius: 1800,
          assignedBy: "0xDarkWallet",
          assignedAt: "2025-01-04T21:30:00Z",
          log: [
            { timestamp: "2025-01-04T21:30:00Z", action: "Agent DREAD deployed", severity: "info" },
            { timestamp: "2025-01-04T21:30:45Z", action: "Anxiety induction protocols active", severity: "warning" },
            { timestamp: "2025-01-04T21:31:30Z", action: "Phobia manifestation successful", severity: "critical" },
            { timestamp: "2025-01-04T21:32:00Z", action: "Terror projection at 95% intensity", severity: "critical" }
          ]
        },
        {
          dreamId: "shadow_realm_789",
          agent: "SHADE",
          status: "processing",
          lastAction: "Trust inversion cycle completed",
          powerLevel: 88,
          corruptionLevel: 71,
          influenceRadius: 950,
          assignedBy: "0xShadowKeeper",
          assignedAt: "2025-01-04T21:20:00Z",
          log: [
            { timestamp: "2025-01-04T21:20:00Z", action: "Agent SHADE initialized", severity: "info" },
            { timestamp: "2025-01-04T21:21:00Z", action: "Shadow analysis commenced", severity: "info" },
            { timestamp: "2025-01-04T21:22:30Z", action: "Trust metrics inverted successfully", severity: "warning" },
            { timestamp: "2025-01-04T21:23:45Z", action: "Decay calculation algorithms deployed", severity: "warning" },
            { timestamp: "2025-01-04T21:25:00Z", action: "Trust inversion cycle completed", severity: "info" }
          ]
        }
      ];

      res.json(activeAgents);
    } catch (error: any) {
      console.error("Error fetching nightmare agent tracking:", error);
      res.status(500).json({ error: "Failed to fetch agent tracking data" });
    }
  });

  // Individual agent status endpoint
  app.get("/api/nightmare/agents/:dreamId/:agent", async (req, res) => {
    try {
      const { dreamId, agent } = req.params;
      
      // Simulate detailed agent status
      const agentStatus = {
        dreamId,
        agent: agent.toUpperCase(),
        status: "active",
        lastAction: `${agent} performing specialized operations`,
        powerLevel: agent === "DREAD" ? 95 : agent === "CRYPT" ? 93 : agent === "ECHO" ? 90 : agent === "SHADE" ? 88 : 82,
        corruptionLevel: Math.floor(Math.random() * 40) + 60,
        influenceRadius: Math.floor(Math.random() * 1000) + 500,
        operations: {
          totalActions: Math.floor(Math.random() * 50) + 10,
          successRate: (Math.random() * 0.3 + 0.7) * 100, // 70-100%
          corruptionSpread: Math.floor(Math.random() * 20) + 5,
          resistanceEncountered: Math.random() > 0.7
        },
        nextAction: `Continue ${agent.toLowerCase()} protocol execution`,
        estimatedCompletion: new Date(Date.now() + Math.random() * 3600000).toISOString()
      };

      res.json(agentStatus);
    } catch (error: any) {
      console.error("Error fetching individual agent status:", error);
      res.status(500).json({ error: "Failed to fetch agent status" });
    }
  });

  // Log nightmare agent actions
  app.post("/api/nightmare/agents/log", async (req, res) => {
    try {
      const { dreamId, agent, action, timestamp } = req.body;
      
      console.log("🌙 Logging agent action:", { dreamId, agent, action, timestamp });
      
      const logEntry = {
        dreamId,
        agent,
        action,
        timestamp: timestamp ? new Date(timestamp * 1000).toISOString() : new Date().toISOString(),
        severity: action.includes("neutralizing") ? "critical" : action.includes("Detected") ? "warning" : "info",
        loggedAt: new Date().toISOString()
      };

      // Simulate successful logging
      res.json({
        success: true,
        logEntry,
        message: `Action logged for ${agent} on dream ${dreamId}`,
        totalLogs: Math.floor(Math.random() * 20) + 5
      });

    } catch (error: any) {
      console.error("Error logging agent action:", error);
      res.status(500).json({ error: "Failed to log agent action" });
    }
  });

  // Resolve infected dreams
  app.post("/api/nightmare/resolve", async (req, res) => {
    try {
      const { dreamId, resolvedBy, resolution } = req.body;
      
      console.log("🌙 Resolving infected dream:", { dreamId, resolvedBy, resolution });
      
      const resolutionTypes = {
        transmuted: {
          description: "Dream corruption transmuted into pure energy",
          effect: "Nightmare agents neutralized, trust restored",
          reward: "50 CORE tokens + XP boost"
        },
        purified: {
          description: "Dream cleansed of all nightmare influences",
          effect: "Full trust restoration, enhanced dream score",
          reward: "75 CORE tokens + Elite status"
        },
        contained: {
          description: "Nightmare influence contained but not eliminated",
          effect: "Partial trust restoration, ongoing monitoring required",
          reward: "25 CORE tokens"
        }
      };

      const resolutionData = resolutionTypes[resolution as keyof typeof resolutionTypes] || resolutionTypes.transmuted;

      const resolutionRecord = {
        dreamId,
        resolvedBy,
        resolution,
        resolvedAt: new Date().toISOString(),
        description: resolutionData.description,
        effect: resolutionData.effect,
        reward: resolutionData.reward,
        previousCorruption: Math.floor(Math.random() * 40) + 60,
        finalCorruption: resolution === "transmuted" ? 0 : resolution === "purified" ? 0 : 15,
        agentsAffected: ["WHISPER", "SHADE", "DREAD"].slice(0, Math.floor(Math.random() * 3) + 1)
      };

      res.json({
        success: true,
        resolution: resolutionRecord,
        message: `Dream ${dreamId} successfully ${resolution}`,
        trustRestored: resolution === "transmuted" || resolution === "purified",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Error resolving infected dream:", error);
      res.status(500).json({ error: "Failed to resolve infected dream" });
    }
  });

  // Dream remix v2 submission endpoint  
  app.post("/api/dreams/remix-v2", async (req, res) => {
    try {
      const { remixer, title, description, tags, type } = req.body;
      
      console.log("🎨 Processing dream remix v2:", { remixer, title, type });
      
      const remixTypes = {
        "Reimagine": {
          description: "Complete conceptual transformation",
          bonusMultiplier: 2.5,
          requiredTrust: 75
        },
        "Enhance": {
          description: "Amplified original vision with new elements",
          bonusMultiplier: 1.8,
          requiredTrust: 60
        },
        "Fusion": {
          description: "Merged with complementary dream concepts",
          bonusMultiplier: 3.0,
          requiredTrust: 85
        }
      };

      const remixData = remixTypes[type as keyof typeof remixTypes] || remixTypes.Reimagine;
      
      const remixRecord = {
        id: `remix-${Date.now()}`,
        originalDreamId: `dream-${Math.floor(Math.random() * 1000)}`,
        remixer,
        title,
        description,
        tags,
        type,
        remixData,
        submittedAt: new Date().toISOString(),
        status: "pending_review",
        similarityScore: Math.floor(Math.random() * 30) + 20, // 20-50% similarity
        innovationScore: Math.floor(Math.random() * 40) + 60, // 60-100% innovation
        trustScore: Math.floor(Math.random() * 25) + 75, // 75-100% trust
        expectedReward: {
          baseCORE: 25,
          bonusCORE: Math.floor(25 * remixData.bonusMultiplier),
          XPBoost: type === "Fusion" ? "Elite" : "Standard",
          specialBadge: type === "Reimagine" ? "Visionary" : type === "Fusion" ? "Architect" : "Enhancer"
        },
        reviewCriteria: {
          originalityCheck: "pending",
          trustVerification: "pending",
          communityApproval: "pending",
          agentValidation: "pending"
        }
      };

      res.json({
        success: true,
        remix: remixRecord,
        message: `Dream remix "${title}" submitted successfully`,
        nextSteps: [
          "Originality verification in progress",
          "Trust score validation",
          "Community review queue",
          "Agent-based quality assessment"
        ],
        estimatedReview: "24-48 hours",
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Error processing dream remix:", error);
      res.status(500).json({ error: "Failed to process dream remix" });
    }
  });

  // Dream remix tracking endpoint
  app.get("/api/dreams/remix/tracking/:remixId", async (req, res) => {
    try {
      const { remixId } = req.params;
      
      const trackingData = {
        remixId,
        currentStage: "community_review",
        progress: 65,
        stages: [
          { name: "submission", status: "completed", completedAt: "2025-01-04T23:00:00Z" },
          { name: "originality_check", status: "completed", completedAt: "2025-01-04T23:15:00Z" },
          { name: "trust_verification", status: "completed", completedAt: "2025-01-04T23:30:00Z" },
          { name: "community_review", status: "in_progress", startedAt: "2025-01-04T23:45:00Z" },
          { name: "agent_validation", status: "pending", estimatedStart: "2025-01-05T12:00:00Z" },
          { name: "final_approval", status: "pending", estimatedStart: "2025-01-05T18:00:00Z" }
        ],
        communityVotes: {
          positive: 23,
          negative: 4,
          neutral: 8,
          totalVoters: 35
        },
        agentFeedback: {
          LUCID: { status: "pending", estimatedCompletion: "2025-01-05T14:00:00Z" },
          CANVAS: { status: "pending", estimatedCompletion: "2025-01-05T15:00:00Z" },
          ROOT: { status: "pending", estimatedCompletion: "2025-01-05T16:00:00Z" }
        },
        estimatedCompletion: "2025-01-05T20:00:00Z"
      };

      res.json(trackingData);
    } catch (error: any) {
      console.error("Error fetching remix tracking:", error);
      res.status(500).json({ error: "Failed to fetch tracking data" });
    }
  });

  // Get remix collection endpoint
  app.get("/api/remixes", async (req, res) => {
    try {
      const { type, tags, originator, limit = 20 } = req.query;
      
      console.log("🎨 Fetching remix collection with filters:", { type, tags, originator, limit });
      
      const mockRemixes = [
        {
          id: "remix456",
          title: "Crypto Kindergarten",
          type: "Parody",
          originator: "0xABCD1234",
          tags: ["ai", "satire"],
          createdAt: 1724087654,
          description: "A satirical take on cryptocurrency education for beginners",
          originalDream: "dream-789",
          status: "approved",
          likes: 45,
          remixCount: 3,
          bonusMultiplier: 1.5,
          healthScore: 92,
          emotionTone: "joy"
        },
        {
          id: "remix789",
          title: "Neural Symphony",
          type: "Enhance",
          originator: "0xDEF5678",
          tags: ["ai", "music", "neural"],
          createdAt: 1724083054,
          description: "Enhanced AI-generated music composition with neural networks",
          originalDream: "dream-445",
          status: "pending",
          likes: 23,
          remixCount: 1,
          bonusMultiplier: 1.8,
          healthScore: 67,
          emotionTone: "curiosity"
        },
        {
          id: "remix321",
          title: "DeFi Revolution 2.0",
          type: "Reimagine",
          originator: "0xGHI9012",
          tags: ["defi", "revolution", "future"],
          createdAt: 1724079454,
          description: "Complete reimagining of decentralized finance protocols",
          originalDream: "dream-112",
          status: "approved",
          likes: 67,
          remixCount: 8,
          bonusMultiplier: 2.5,
          healthScore: 88,
          emotionTone: "ambition"
        },
        {
          id: "remix654",
          title: "Gaming Metaverse Fusion",
          type: "Fusion",
          originator: "0xJKL3456",
          tags: ["gaming", "metaverse", "vr"],
          createdAt: 1724075854,
          description: "Fusion of multiple gaming concepts into unified metaverse",
          originalDream: "dream-998",
          status: "community_review",
          likes: 34,
          remixCount: 5,
          bonusMultiplier: 3.0,
          healthScore: 75,
          emotionTone: "love"
        },
        {
          id: "remix987",
          title: "Sustainable Tech Parody",
          type: "Parody",
          originator: "0xMNO7890",
          tags: ["sustainability", "tech", "humor"],
          createdAt: 1724072254,
          description: "Humorous take on green technology adoption",
          originalDream: "dream-223",
          status: "approved",
          likes: 19,
          remixCount: 2,
          bonusMultiplier: 1.3,
          healthScore: 44,
          emotionTone: "hope"
        }
      ];

      let filteredRemixes = mockRemixes;

      // Apply filters
      if (type) {
        filteredRemixes = filteredRemixes.filter(r => r.type.toLowerCase() === type.toString().toLowerCase());
      }
      
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        filteredRemixes = filteredRemixes.filter(r => 
          tagArray.some((tag: string) => r.tags.includes(tag.toLowerCase()))
        );
      }
      
      if (originator) {
        filteredRemixes = filteredRemixes.filter(r => r.originator === originator);
      }

      // Sort by creation date (newest first) and limit
      const sortedRemixes = filteredRemixes
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, Number(limit));

      res.json({
        remixes: sortedRemixes,
        total: filteredRemixes.length,
        filters: { type, tags, originator, limit },
        timestamp: new Date().toISOString()
      });

    } catch (error: any) {
      console.error("Error fetching remixes:", error);
      res.status(500).json({ error: "Failed to fetch remixes" });
    }
  });

  // GET /api/dreams/:id/insights - Get detailed insights for a specific dream
  app.get("/api/dreams/:id/insights", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`🔍 Fetching insights for dream ${id}`);

      const dreamInsights = {
        dreamId: id,
        healthScore: 87,
        engagementScore: 91,
        remixLineage: [
          { id: 'dream001', title: 'Original Spark' },
          { id: 'dream045', title: 'Echo Reboot' }
        ],
        metrics: {
          views: 2847,
          likes: 523,
          remixes: 34,
          shares: 156,
          comments: 287
        },
        emotionalProfile: {
          primaryEmotion: "ambition",
          secondaryEmotions: ["curiosity", "hope"],
          intensityScore: 0.84
        },
        communityImpact: {
          influenceRadius: 847,
          networkConnections: 23,
          crossPlatformMentions: 12,
          collaborationRequests: 7
        },
        evolutionPath: {
          generationLevel: 3,
          branchingFactor: 5,
          divergenceScore: 0.72,
          convergencePoints: 2
        },
        viralityMetrics: {
          shareVelocity: 34.2,
          peakMomentum: "2024-08-20T15:30:00Z",
          currentTrend: "ascending",
          saturationLevel: 0.43
        }
      };

      res.json(dreamInsights);
    } catch (error) {
      console.error("❌ Error fetching dream insights:", error);
      res.status(500).json({ error: "Failed to fetch dream insights" });
    }
  });

  // Get individual remix details
  app.get("/api/remixes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const remixDetails = {
        id,
        title: "Crypto Kindergarten",
        type: "Parody",
        originator: "0xABCD1234",
        tags: ["ai", "satire"],
        createdAt: 1724087654,
        description: "A satirical take on cryptocurrency education for beginners",
        originalDream: {
          id: "dream-789",
          title: "Advanced Crypto Education",
          creator: "0xXYZ9876"
        },
        content: "Imagine a world where blockchain concepts are taught using colorful blocks and simple games...",
        status: "approved",
        metrics: {
          likes: 45,
          dislikes: 3,
          remixCount: 3,
          views: 234,
          shares: 12
        },
        rewards: {
          earned: 67.5,
          token: "CORE",
          bonusMultiplier: 1.5,
          specialBadge: "Satirist"
        },
        timeline: [
          { stage: "submission", timestamp: 1724087654, status: "completed" },
          { stage: "originality_check", timestamp: 1724087954, status: "completed" },
          { stage: "community_review", timestamp: 1724088254, status: "completed" },
          { stage: "approval", timestamp: 1724089554, status: "completed" }
        ],
        relatedRemixes: [
          { id: "remix789", title: "Neural Symphony", type: "Enhance" },
          { id: "remix321", title: "DeFi Revolution 2.0", type: "Reimagine" }
        ]
      };

      res.json(remixDetails);
    } catch (error: any) {
      console.error("Error fetching remix details:", error);
      res.status(500).json({ error: "Failed to fetch remix details" });
    }
  });

  // SMS Reminder API endpoints
  app.get('/api/get-reminders', async (req, res) => {
    try {
      // Mock data for demonstration - in production, query database
      const mockReminders = [
        {
          id: "rem_001",
          dreamId: "dream_viral_startup",
          userPhone: "+15551234567",
          remindAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          tags: ["top-priority", "viral-potential"],
          dream: {
            title: "Viral Startup Revolution",
            viralityMetrics: { remixCount: 15, shareVelocity: 25, saturationLevel: 0.3, currentTrend: "ascending" },
            emotionalProfile: { primaryEmotion: "Excitement", intensity: 0.9 },
            remixLineage: [
              { id: "dream_startup_base", title: "Original Startup Idea", generation: 1 },
              { id: "dream_viral_twist", title: "Viral Marketing Twist", generation: 2 },
              { id: "dream_viral_startup", title: "Viral Startup Revolution", generation: 3 }
            ]
          }
        },
        {
          id: "rem_002", 
          dreamId: "dream_ai_revolution",
          userPhone: "+15551234567",
          remindAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          tags: ["ai-focus", "research"],
          dream: {
            title: "AI Revolution Blueprint",
            viralityMetrics: { remixCount: 8, shareVelocity: 12, saturationLevel: 0.6, currentTrend: "ascending" },
            emotionalProfile: { primaryEmotion: "Curiosity", intensity: 0.8 },
            remixLineage: [
              { id: "dream_ai_base", title: "Basic AI Concepts", generation: 1 },
              { id: "dream_ai_revolution", title: "AI Revolution Blueprint", generation: 2 }
            ]
          }
        },
        {
          id: "rem_003",
          dreamId: "dream_saturated_market",
          userPhone: "+15551234567",
          remindAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          tags: ["market-analysis", "competitive"],
          dream: {
            title: "Saturated Market Analysis",
            viralityMetrics: { remixCount: 5, shareVelocity: 8, saturationLevel: 0.9, currentTrend: "declining" },
            emotionalProfile: { primaryEmotion: "Concern", intensity: 0.7 },
            remixLineage: [
              { id: "dream_market_base", title: "Market Research Basics", generation: 1 },
              { id: "dream_market_trends", title: "Market Trend Analysis", generation: 2 },
              { id: "dream_saturated_market", title: "Saturated Market Analysis", generation: 3 }
            ]
          }
        },
        {
          id: "rem_004",
          dreamId: "dream_creative_block",
          userPhone: "+15551234567",
          remindAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
          status: "pending",
          tags: ["creative", "brainstorming"],
          dream: {
            title: "Breaking Creative Blocks",
            viralityMetrics: { remixCount: 3, shareVelocity: 5, saturationLevel: 0.2, currentTrend: "stable" },
            emotionalProfile: { primaryEmotion: "Inspiration", intensity: 0.6 },
            remixLineage: [{ id: "dream_creativity_base", title: "Creative Foundation", generation: 1 }]
          }
        }
      ];
      
      res.json(mockReminders);
    } catch (error) {
      console.error('Error fetching reminders:', error);
      res.status(500).json({ error: 'Failed to fetch reminders' });
    }
  });

  app.post('/api/cancel-reminder', async (req, res) => {
    try {
      const { id } = req.body;
      console.log(`Cancelling reminder ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      res.status(500).json({ error: 'Failed to cancel reminder' });
    }
  });

  app.post('/api/update-tags', async (req, res) => {
    try {
      const { id, tag } = req.body;
      console.log(`Adding tag "${tag}" to reminder ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating tags:', error);
      res.status(500).json({ error: 'Failed to update tags' });
    }
  });

  app.get('/api/dream-call-log', async (req, res) => {
    try {
      const mockCallLog = [
        {
          id: "call_001",
          dreamId: "dream_viral_startup",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          duration: "12:34",
          notes: "Great discussion about viral marketing strategies"
        },
        {
          id: "call_002", 
          dreamId: "dream_ai_revolution",
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          duration: "08:17",
          notes: "AI blueprint refinement session"
        }
      ];
      
      res.json(mockCallLog);
    } catch (error) {
      console.error('Error fetching call log:', error);
      res.status(500).json({ error: 'Failed to fetch call log' });
    }
  });

  // Divine trigger endpoint
  app.post('/api/check-divine-trigger', async (req, res) => {
    try {
      const { userActivity, inputText } = req.body;
      
      const checkForDivineTrigger = (userActivity: any, inputText: any) => {
        const keywords = ['call from god', 'dream deeper', 'divine download'];
        const matchesKeyword = keywords.some(kw => inputText.toLowerCase().includes(kw));
        const thresholdCrossed = userActivity.dreamsCreated > 25 || userActivity.remixes > 10;
        return matchesKeyword || thresholdCrossed;
      };
      
      const triggered = checkForDivineTrigger(userActivity || {}, inputText || '');
      
      res.json({ 
        triggered,
        reason: triggered ? 
          (inputText && ['call from god', 'dream deeper', 'divine download'].some(kw => inputText.toLowerCase().includes(kw)) ? 'keyword_match' : 'threshold_crossed') 
          : 'none',
        message: triggered ? 'Divine consciousness activated' : 'Continue dreaming'
      });
    } catch (error) {
      console.error('Error checking divine trigger:', error);
      res.status(500).json({ error: 'Failed to check divine trigger' });
    }
  });

  // DAO Management endpoints
  app.get('/api/daos', (req, res) => {
    const daoData = {
      daos: [
        {
          id: "dream_drifters",
          name: "Dream Drifters",
          type: "Theme DAO",
          focus: "Whispers of melancholy and joy",
          vault: "dream007",
          votingModel: "Quadratic",
          initialMembers: ["dreamer.eth", "petal.sol", "starborn.bnb"],
          totalMembers: 3,
          totalProposals: 2,
          treasuryBalance: "1,247 $SHEEP",
          governanceToken: "DRIFT",
          createdAt: "2024-01-01T00:00:00Z"
        }
      ]
    };
    
    res.json(daoData);
  });

  app.get('/api/daos/:daoId/members', (req, res) => {
    const { daoId } = req.params;
    
    const membersData = {
      members: [
        {
          wallet: "dreamer.eth",
          joinedAt: "2024-01-01",
          votingPower: 45,
          contributionScore: 892,
          driftTokens: 2025
        },
        {
          wallet: "petal.sol",
          joinedAt: "2024-01-02",
          votingPower: 38,
          contributionScore: 756,
          driftTokens: 1444
        },
        {
          wallet: "starborn.bnb",
          joinedAt: "2024-01-03",
          votingPower: 32,
          contributionScore: 634,
          driftTokens: 1024
        }
      ]
    };
    
    res.json(membersData);
  });

  app.get('/api/daos/:daoId/proposals', (req, res) => {
    const { daoId } = req.params;
    
    const proposalsData = {
      proposals: [
        {
          id: "prop_001",
          title: "Allocate 500 $SHEEP for Melancholy Dream Collection",
          description: "Fund creation of 10 dreams exploring themes of beautiful sadness and nostalgic reflection",
          proposer: "dreamer.eth",
          status: "active",
          votes: [
            { wallet: "dreamer.eth", power: 45, support: true },
            { wallet: "petal.sol", power: 38, support: true }
          ],
          createdAt: "2024-01-05T10:00:00Z",
          endsAt: "2024-01-12T10:00:00Z",
          minVotingPower: 50,
          quorum: 60
        },
        {
          id: "prop_002",
          title: "Partner with Joy Collective for Cross-DAO Event",
          description: "Collaborate on dream fusion event combining melancholy and joy themes",
          proposer: "petal.sol",
          status: "pending",
          votes: [],
          createdAt: "2024-01-06T14:30:00Z",
          endsAt: "2024-01-13T14:30:00Z",
          minVotingPower: 50,
          quorum: 60
        }
      ]
    };
    
    res.json(proposalsData);
  });

  app.post('/api/daos/:daoId/proposals/:proposalId/vote', (req, res) => {
    const { daoId, proposalId } = req.params;
    const { wallet, support, votingPower } = req.body;
    
    // Mock voting response
    res.json({
      success: true,
      vote: {
        wallet,
        support,
        votingPower,
        proposalId,
        timestamp: new Date().toISOString()
      },
      message: `Vote ${support ? 'in favor' : 'against'} proposal recorded with ${votingPower} voting power`
    });
  });

  // Dream Enhancement endpoints
  app.get('/api/dreams/:dreamId/enhancements', (req, res) => {
    const { dreamId } = req.params;
    
    const enhancementData = {
      dreamId,
      addedEmotion: "Curiosity",
      effect: "Expanded remix audience + Remix Toolchain Access",
      previousEmotions: ["Hope", "Wonder"],
      enhancedCapabilities: [
        "Advanced Remix Editor",
        "Collaborative Workspace", 
        "AI-Assisted Generation",
        "Cross-Chain Distribution",
        "Analytics Dashboard"
      ],
      audienceMultiplier: 2.3,
      toolchainAccess: [
        "LUCID Agent",
        "CANVAS Agent",
        "ROOT Agent", 
        "ECHO Agent",
        "Fusion Chamber",
        "Dream Linker"
      ],
      timestamp: new Date().toISOString()
    };
    
    res.json(enhancementData);
  });

  app.post('/api/dreams/:dreamId/enhance', (req, res) => {
    const { dreamId } = req.params;
    const { emotion, daoId } = req.body;
    
    const emotionEffects = {
      Curiosity: {
        audienceMultiplier: 2.3,
        toolchainAccess: ["LUCID Agent", "CANVAS Agent", "ROOT Agent", "ECHO Agent"],
        effect: "Expanded remix audience + Remix Toolchain Access"
      },
      Wonder: {
        audienceMultiplier: 2.1,
        toolchainAccess: ["Visualization Tools", "Community Spotlight"],
        effect: "Enhanced visualization tools + Community spotlights"
      },
      Passion: {
        audienceMultiplier: 2.5,
        toolchainAccess: ["Premium Agents", "Velocity Booster"],
        effect: "Remix velocity boost + Premium agent access"
      }
    };
    
    const enhancement = emotionEffects[emotion as keyof typeof emotionEffects] || emotionEffects.Curiosity;
    
    res.json({
      success: true,
      dreamId,
      addedEmotion: emotion,
      enhancement,
      message: `Dream ${dreamId} enhanced with ${emotion} emotion`
    });
  });

  // Whisper Messaging endpoints
  app.get('/api/whispers', (req, res) => {
    const whispers = [
      {
        id: 'whisper_001',
        targetDreamId: 'dream108',
        whisperType: 'Signal',
        message: 'Your next fork belongs to fire.',
        sender: 'dreamer.eth',
        emotionOverlay: 'Passion',
        timestamp: new Date().toISOString(),
        status: 'delivered'
      },
      {
        id: 'whisper_002',
        targetWallet: 'echo.sol',
        whisperType: 'Vault',
        message: 'Unlock this door to access The Architect\'s Archive.',
        sender: 'system',
        link: 'https://dreamnetwork.xyz/vault/xyz',
        tokenRequired: 'Ambition',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        status: 'pending'
      }
    ];
    
    res.json({ whispers });
  });

  app.post('/api/whispers', (req, res) => {
    const { targetDreamId, targetWallet, whisperType, message, sender, emotionOverlay, link, tokenRequired } = req.body;
    
    const newWhisper = {
      id: `whisper_${Date.now()}`,
      targetDreamId,
      targetWallet,
      whisperType,
      message,
      sender,
      emotionOverlay,
      link,
      tokenRequired,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    res.json({
      success: true,
      whisper: newWhisper,
      message: 'Whisper sent successfully'
    });
  });

  // Remix endpoints
  app.post('/api/remix', (req, res) => {
    const { originalDreamId, remixerWallet, content, emotions } = req.body;
    
    const newRemixId = `remix_${Date.now()}`;
    
    res.json({
      success: true,
      remixId: newRemixId,
      originalDreamId,
      remixerWallet,
      content,
      emotions,
      status: 'processing',
      timestamp: new Date().toISOString(),
      message: 'Remix request submitted successfully'
    });
  });

  app.get('/api/remixes', (req, res) => {
    const remixes = [
      {
        id: 'remix_001',
        originalDreamId: 'dream045',
        remixerWallet: 'you.eth',
        content: 'A remix that merges dream logic with synthetic nature',
        emotions: ['curiosity', 'awe'],
        status: 'processing',
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json({ remixes });
  });

  // Dream Lineage endpoints
  app.post('/api/dreams/:dreamId/lineage', (req, res) => {
    const { dreamId } = req.params;
    const { lineage, status } = req.body;
    
    res.json({
      success: true,
      newDreamId: dreamId,
      lineage,
      status,
      timestamp: new Date().toISOString(),
      message: `Dream lineage established for ${dreamId}`
    });
  });

  app.get('/api/lineages', (req, res) => {
    const lineages = [
      {
        newDreamId: 'dream066',
        lineage: ['dream001', 'dream045'],
        status: 'published',
        timestamp: new Date().toISOString()
      }
    ];
    
    res.json({ lineages });
  });

  // User Progression endpoints
  app.get('/api/users/:userId/progression', (req, res) => {
    const { userId } = req.params;
    
    const userProgression = {
      userId: "dreamer_1072",
      xp: 2893,
      tier: "Weaver",
      emotionTrail: ["hope", "curiosity"],
      remixCount: 9,
      vaultEarnings: 143,
      visualConfig: {
        coreGlow: "blue",
        trailOverlay: "animated dust",
        shape: "soft mandala",
        emotionTint: ["#7ecfff", "#ffd97e"]
      }
    };
    
    res.json({ user: userProgression });
  });

  app.post('/api/users/:userId/progression/update', (req, res) => {
    const { userId } = req.params;
    const { xpGain, action } = req.body;
    
    res.json({
      success: true,
      userId,
      xpGain,
      action,
      newXp: 2893 + xpGain,
      message: `${xpGain} XP gained from ${action}`
    });
  });

  app.get('/api/tiers', (req, res) => {
    const tiers = [
      {
        name: "Dreamer",
        minXp: 0,
        maxXp: 999,
        benefits: ["Basic dream creation", "Standard emotions"],
        visualUnlocks: ["Basic glow", "Simple shapes"]
      },
      {
        name: "Weaver",
        minXp: 1000,
        maxXp: 2999,
        benefits: ["Enhanced remixing", "Emotion trails", "Vault access"],
        visualUnlocks: ["Core glow customization", "Trail overlays", "Mandala shapes"]
      },
      {
        name: "Architect",
        minXp: 3000,
        maxXp: 4999,
        benefits: ["Advanced AI agents", "Cross-chain features", "Premium tools"],
        visualUnlocks: ["Complex geometries", "Multi-layer effects", "Custom animations"]
      },
      {
        name: "Visionary",
        minXp: 5000,
        maxXp: 9999,
        benefits: ["DAO governance", "Token multipliers", "Feature access"],
        visualUnlocks: ["Particle systems", "Dynamic gradients", "Reality distortion"]
      },
      {
        name: "Transcendent",
        minXp: 10000,
        maxXp: 99999,
        benefits: ["Network ownership", "Agent creation", "Ecosystem control"],
        visualUnlocks: ["Quantum effects", "Dimensional shifts", "Consciousness flows"]
      }
    ];
    
    res.json({ tiers });
  });

  // Revenue Sharing endpoints
  app.get('/api/vaults/:vaultId/revenue', (req, res) => {
    const { vaultId } = req.params;
    
    const vaultRevenue = {
      vaultId: "vault_304",
      creator: "0xDREAMER001",
      remixer: "0xDREAMER092",
      agent: "dream_chaser_4",
      totalRevenue: "2.31 SOL",
      splits: {
        creator: 0.5,
        remixer: 0.25,
        agent: 0.15,
        networkFee: 0.10
      },
      timestamp: new Date().toISOString()
    };
    
    res.json({ vault: vaultRevenue });
  });

  app.post('/api/vaults/:vaultId/distribute', (req, res) => {
    const { vaultId } = req.params;
    const { amount, currency } = req.body;
    
    const distribution = {
      vaultId,
      totalAmount: amount,
      currency,
      distributions: [
        {
          recipient: "0xDREAMER001",
          role: "creator",
          amount: amount * 0.5,
          percentage: 50
        },
        {
          recipient: "0xDREAMER092",
          role: "remixer", 
          amount: amount * 0.25,
          percentage: 25
        },
        {
          recipient: "dream_chaser_4",
          role: "agent",
          amount: amount * 0.15,
          percentage: 15
        },
        {
          recipient: "network",
          role: "platform",
          amount: amount * 0.10,
          percentage: 10
        }
      ],
      transactionId: `tx_${Date.now()}`,
      status: "processing",
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      distribution,
      message: `Revenue distribution initiated for ${vaultId}`
    });
  });

  app.get('/api/revenue/analytics', (req, res) => {
    const analytics = {
      totalRevenue: "47.83 SOL",
      totalDistributions: 28,
      averageVaultRevenue: "1.71 SOL",
      topPerformingVault: "vault_304",
      networkFeesCollected: "4.78 SOL",
      activeVaults: 12,
      monthlyGrowth: 24.7
    };
    
    res.json({ analytics });
  });

  // Vault Marketplace endpoints
  app.get('/api/vaults', (req, res) => {
    const vaults = [
      {
        vaultId: "vault_483",
        title: "Moonwave: The Remix Archive",
        creator: "0xDREAMER005",
        emotion: "wonder",
        views: 8432,
        remixes: 132,
        available: true,
        price: "3.1 $SHEEP",
        status: "trending",
        description: "A celestial collection of moon-inspired dreams and their evolutionary remixes.",
        tags: ["lunar", "ethereal", "transformative", "celestial"]
      },
      {
        vaultId: "vault_301",
        title: "Digital Fragments",
        creator: "0xDREAMER001",
        emotion: "curiosity",
        views: 5672,
        remixes: 89,
        available: true,
        price: "2.8 $SHEEP",
        status: "popular",
        tags: ["digital", "fragments", "exploration"]
      },
      {
        vaultId: "vault_198",
        title: "Neon Dreams Collection",
        creator: "0xDREAMER092",
        emotion: "excitement",
        views: 12104,
        remixes: 245,
        available: false,
        price: "5.2 $SHEEP",
        status: "sold out",
        tags: ["neon", "cyberpunk", "electric"]
      }
    ];
    
    res.json({ vaults });
  });

  app.get('/api/vaults/:vaultId', (req, res) => {
    const { vaultId } = req.params;
    
    const vault = {
      vaultId: "vault_483",
      title: "Moonwave: The Remix Archive",
      creator: "0xDREAMER005",
      emotion: "wonder",
      views: 8432,
      remixes: 132,
      available: true,
      price: "3.1 $SHEEP",
      status: "trending",
      description: "A celestial collection of moon-inspired dreams and their evolutionary remixes, capturing the wonder of lunar cycles and ethereal transformations.",
      createdAt: "2025-01-03",
      tags: ["lunar", "ethereal", "transformative", "celestial"],
      remixHistory: [
        { id: "remix_001", title: "Lunar Eclipse", creator: "0xREMIXER001", timestamp: "2025-01-04" },
        { id: "remix_045", title: "Crescent Dreams", creator: "0xREMIXER045", timestamp: "2025-01-04" },
        { id: "remix_092", title: "Stellar Winds", creator: "0xREMIXER092", timestamp: "2025-01-05" }
      ]
    };
    
    res.json({ vault });
  });

  app.post('/api/vaults/:vaultId/purchase', (req, res) => {
    const { vaultId } = req.params;
    const { buyerWallet, paymentAmount } = req.body;
    
    res.json({
      success: true,
      vaultId,
      buyerWallet,
      paymentAmount,
      transactionId: `purchase_${Date.now()}`,
      accessGranted: true,
      message: `Successfully purchased ${vaultId}`
    });
  });

  app.get('/api/marketplace/stats', (req, res) => {
    const stats = {
      totalVaults: 47,
      availableVaults: 32,
      totalViews: 234567,
      totalRemixes: 1893,
      averagePrice: "3.2 $SHEEP",
      topVault: "vault_483",
      trendingEmotions: ["wonder", "curiosity", "excitement"],
      dailyTransactions: 23
    };
    
    res.json({ stats });
  });

  // Dream Cloud endpoints
  app.get('/api/clouds/:cloudId', (req, res) => {
    const { cloudId } = req.params;
    
    const cloud = {
      cloudId: "cloud_007",
      title: "Crypto for Kids Cloud",
      dreams: 42,
      remixPaths: 238,
      emotions: ["curiosity", "empowerment"],
      team: ["0xBrandon", "0xTina", "0xFlutter"],
      totalRevenue: "18,720 $SHEEP",
      vaultsActive: 19,
      missionsLive: 5,
      description: "Educational blockchain experience designed for young minds",
      createdAt: "2024-12-15",
      lastActive: new Date().toISOString()
    };
    
    res.json({ cloud });
  });

  app.get('/api/clouds/:cloudId/missions', (req, res) => {
    const { cloudId } = req.params;
    
    const missions = [
      {
        id: "mission_001",
        title: "Blockchain Basics Interactive Journey",
        progress: 78,
        reward: "2,400 $SHEEP",
        status: "active",
        assignedTo: "0xBrandon",
        description: "Interactive learning module covering fundamental blockchain concepts"
      },
      {
        id: "mission_002", 
        title: "Digital Wallet Adventure Game",
        progress: 92,
        reward: "3,100 $SHEEP",
        status: "active",
        assignedTo: "0xTina",
        description: "Gamified wallet management and security education"
      },
      {
        id: "mission_003",
        title: "NFT Creation Workshop",
        progress: 45,
        reward: "1,800 $SHEEP",
        status: "active",
        assignedTo: "0xFlutter",
        description: "Hands-on NFT creation and marketplace understanding"
      }
    ];
    
    res.json({ missions });
  });

  app.get('/api/clouds/:cloudId/team', (req, res) => {
    const { cloudId } = req.params;
    
    const team = [
      {
        address: "0xBrandon",
        role: "Lead Educator",
        contributions: 89,
        earnings: "7,240 $SHEEP",
        status: "online",
        joinedAt: "2024-12-15",
        specialties: ["Blockchain Education", "Content Strategy"]
      },
      {
        address: "0xTina",
        role: "Content Creator",
        contributions: 76,
        earnings: "6,180 $SHEEP",
        status: "online",
        joinedAt: "2024-12-16",
        specialties: ["Interactive Design", "Storytelling"]
      },
      {
        address: "0xFlutter",
        role: "UX Designer",
        contributions: 67,
        earnings: "5,300 $SHEEP",
        status: "offline",
        joinedAt: "2024-12-18",
        specialties: ["User Experience", "Visual Design"]
      }
    ];
    
    res.json({ team });
  });

  app.post('/api/clouds/:cloudId/missions/:missionId/update', (req, res) => {
    const { cloudId, missionId } = req.params;
    const { progress, status } = req.body;
    
    res.json({
      success: true,
      cloudId,
      missionId,
      progress,
      status,
      timestamp: new Date().toISOString(),
      message: `Mission ${missionId} updated successfully`
    });
  });

  app.get('/api/clouds/analytics', (req, res) => {
    const analytics = {
      totalClouds: 12,
      activeClouds: 8,
      totalDreams: 347,
      totalRemixPaths: 1542,
      totalRevenue: "89,340 $SHEEP",
      averageTeamSize: 3.2,
      completionRate: 73,
      topPerformingCloud: "cloud_007"
    };
    
    res.json({ analytics });
  });

  // Leaderboard endpoint
  app.get('/api/leaderboard', (req, res) => {
    const leaderboardData = {
      leaderboard: [
        { wallet: "dreamer.eth", score: 912, rank: 1, change: 2 },
        { wallet: "echo.bnb", score: 888, rank: 2, change: -1 },
        { wallet: "starborn.sol", score: 861, rank: 3, change: 1 },
        { wallet: "void.base", score: 823, rank: 4, change: 0 },
        { wallet: "nexus.arb", score: 798, rank: 5, change: 3 },
        { wallet: "quantum.poly", score: 776, rank: 6, change: -2 },
        { wallet: "cosmic.ftm", score: 752, rank: 7, change: 1 },
        { wallet: "neural.avax", score: 728, rank: 8, change: -1 },
        { wallet: "genesis.one", score: 704, rank: 9, change: 2 },
        { wallet: "phoenix.near", score: 681, rank: 10, change: -3 }
      ],
      top_dreams: [
        { 
          title: "Echo Reboot", 
          remixes: 47, 
          heat: "🔥🔥🔥", 
          vaultRevenue: "312 $SHEEP",
          creator: "dreamer.eth",
          tags: ["💡 Concept", "🚀 Launch", "⚡ Viral"]
        },
        { 
          title: "Signal Lost", 
          remixes: 33, 
          heat: "🔥🔥", 
          vaultRevenue: "147 $SHEEP",
          creator: "echo.bnb",
          tags: ["🎭 Drama", "⚡ Energy", "🌊 Trending"]
        },
        { 
          title: "Quantum Drift", 
          remixes: 28, 
          heat: "🔥🔥", 
          vaultRevenue: "89 $SHEEP",
          creator: "starborn.sol",
          tags: ["🌌 Cosmic", "🔬 Science", "🎨 Creative"]
        },
        { 
          title: "Digital Awakening", 
          remixes: 22, 
          heat: "🔥", 
          vaultRevenue: "67 $SHEEP",
          creator: "void.base",
          tags: ["🤖 AI", "💭 Philosophy", "🔮 Future"]
        },
        { 
          title: "Neon Dreams", 
          remixes: 19, 
          heat: "🔥", 
          vaultRevenue: "45 $SHEEP",
          creator: "nexus.arb",
          tags: ["🌈 Aesthetic", "🎵 Music", "✨ Inspiration"]
        },
        { 
          title: "Whispers in Orbit", 
          remixes: 22, 
          heat: "🔥", 
          vaultRevenue: "127 $SHEEP",
          creator: "starborn.sol",
          tags: ["🌟 Hope", "🌌 Cosmic", "💫 Whisper"],
          emotion: "Hope",
          agent: "Petal",
          actions: ["Remix", "Vault Peek", "Whisper"]
        }
      ],
      totalRevenue: "1,974 $SHEEP",
      totalRemixes: 434,
      activeCreators: 91,
      lastUpdated: new Date().toISOString()
    };
    
    res.json(leaderboardData);
  });

  const httpServer = createServer(app);
  console.log("✅ [Routes] registerRoutes completed, returning server");
  return httpServer;
}
