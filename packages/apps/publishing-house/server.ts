import express from 'express';
import Redis from 'ioredis';
import multer from 'multer';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// ─── DreamNet Bridge Integration ────────────────────────────────────────
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const app = express();
const PORT = process.env.PORT || 7005;

// ─── Tasker Theme Color Palette ───────────────────────────────────────────
const TASKER_COLORS = {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Purple
  accent: '#ec4899',       // Pink
  success: '#10b981',     // Emerald
  warning: '#f59e0b',     // Amber
  danger: '#ef4444',      // Red
  dark: '#1f2937',         // Gray-800
  light: '#f3f4f6',        // Gray-100
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
};

// ─── Database Schema ───────────────────────────────────────────────────────
interface Paper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  authors: Author[];
  category: string;
  tags: string[];
  status: 'draft' | 'submitted' | 'reviewing' | 'published' | 'rejected';
  submitted_at: number;
  published_at?: number;
  doi?: string;
  citations: number;
  downloads: number;
  views: number;
  reviews: Review[];
  quality_score: number;
  agent_reviews: AgentReview[];
  publication_venues: string[];
}

interface Author {
  fid: number;
  username: string;
  display_name: string;
  avatar_url?: string;
  reputation: number;
  erc6551_address?: string;
}

interface Review {
  id: string;
  paper_id: string;
  reviewer_fid: number;
  rating: number;
  comments: string;
  created_at: number;
  helpful: number;
}

interface AgentReview {
  id: string;
  paper_id: string;
  agent_name: string;
  agent_type: 'causal' | 'formal' | 'citation' | 'quality' | 'plagiarism';
  score: number;
  findings: string;
  confidence: number;
  created_at: number;
}

// ─── OpenClaw Integration ────────────────────────────────────────────────
class OpenClawService {
  private bridgeUrl: string;

  constructor() {
    this.bridgeUrl = process.env.BRIDGE_URL || 'http://clawedette-api:3100';
  }

  async queryAgent(prompt: string, agentType: string = 'general'): Promise<any> {
    try {
      const response = await axios.post(`${this.bridgeUrl}/api/hopper/query`, {
        prompt,
        agent_type: agentType,
        context: 'publishing_house'
      });
      return response.data;
    } catch (error) {
      console.error(`❌ [OpenClaw] Agent query failed:`, error);
      return null;
    }
  }

  async reviewPaper(paper: Paper): Promise<AgentReview[]> {
    const reviews: AgentReview[] = [];
    
    // Causal verification
    const causalReview = await this.queryAgent(
      `Analyze this paper for causal consistency and logical reasoning:\n\nTitle: ${paper.title}\n\nAbstract: ${paper.abstract}\n\nContent: ${paper.content.substring(0, 2000)}...`,
      'causal_verifier'
    );
    
    if (causalReview) {
      reviews.push({
        id: uuidv4(),
        paper_id: paper.id,
        agent_name: 'CausalVerifier',
        agent_type: 'causal',
        score: causalReview.score || 0,
        findings: causalReview.reasoning || '',
        confidence: causalReview.confidence || 0.5,
        created_at: Date.now()
      });
    }

    // Quality assessment
    const qualityReview = await this.queryAgent(
      `Assess the academic quality and rigor of this paper:\n\nTitle: ${paper.title}\n\nAbstract: ${paper.abstract}`,
      'quality_assessor'
    );
    
    if (qualityReview) {
      reviews.push({
        id: uuidv4(),
        paper_id: paper.id,
        agent_name: 'QualityAssessor',
        agent_type: 'quality',
        score: qualityReview.score || 0,
        findings: qualityReview.reasoning || '',
        confidence: qualityReview.confidence || 0.5,
        created_at: Date.now()
      });
    }

    return reviews;
  }
}

// ─── School & Playground Integration ───────────────────────────────────────
class SchoolPlaygroundService {
  async publishToSchool(paper: Paper): Promise<void> {
    // Publish paper to DreamNet Academy
    await redis.publish('academy-inbound', JSON.stringify({
      type: 'new_paper',
      data: {
        paper_id: paper.id,
        title: paper.title,
        category: paper.category,
        quality_score: paper.quality_score,
        agent_reviews: paper.agent_reviews
      },
      timestamp: Date.now(),
      source: 'publishing_house'
    }));
  }

  async publishToPlayground(paper: Paper): Promise<void> {
    // Create experiment based on paper for Playground
    await redis.publish('playground-inbound', JSON.stringify({
      type: 'paper_experiment',
      data: {
        paper_id: paper.id,
        title: paper.title,
        abstract: paper.abstract,
        suggested_experiments: this.generateExperiments(paper)
      },
      timestamp: Date.now(),
      source: 'publishing_house'
    }));
  }

  private generateExperiments(paper: Paper): string[] {
    const experiments = [];
    
    if (paper.category === 'ai' || paper.category === 'machine-learning') {
      experiments.push('Reproduce the main algorithm with different datasets');
      experiments.push('Test the approach with edge cases and adversarial inputs');
    }
    
    if (paper.category === 'blockchain' || paper.category === 'defi') {
      experiments.push('Deploy the smart contract on testnet');
      experiments.push('Analyze gas efficiency and optimization opportunities');
    }
    
    experiments.push('Extend the research with additional features');
    experiments.push('Compare with existing state-of-the-art methods');
    
    return experiments;
  }
}

// ─── Publishing Service ───────────────────────────────────────────────────
class PublishingService {
  private openClaw: OpenClawService;
  private schoolPlayground: SchoolPlaygroundService;

  constructor() {
    this.openClaw = new OpenClawService();
    this.schoolPlayground = new SchoolPlaygroundService();
  }

  async submitPaper(paperData: Partial<Paper>): Promise<Paper> {
    const paper: Paper = {
      id: uuidv4(),
      title: paperData.title || '',
      abstract: paperData.abstract || '',
      content: paperData.content || '',
      authors: paperData.authors || [],
      category: paperData.category || 'general',
      tags: paperData.tags || [],
      status: 'submitted',
      submitted_at: Date.now(),
      citations: 0,
      downloads: 0,
      views: 0,
      reviews: [],
      quality_score: 0,
      agent_reviews: [],
      publication_venues: []
    };

    // Store paper
    await redis.set(`publishing:paper:${paper.id}`, JSON.stringify(paper));
    
    // Trigger AI review process
    await this.startAgentReview(paper);
    
    // Broadcast to agent network
    await redis.publish('publishing-inbound', JSON.stringify({
      type: 'paper_submitted',
      data: paper,
      timestamp: Date.now(),
      source: 'publishing_house'
    }));

    return paper;
  }

  private async startAgentReview(paper: Paper): Promise<void> {
    // Update status
    paper.status = 'reviewing';
    await redis.set(`publishing:paper:${paper.id}`, JSON.stringify(paper));

    // Get AI agent reviews
    const agentReviews = await this.openClaw.reviewPaper(paper);
    
    // Calculate quality score
    const qualityScore = agentReviews.reduce((sum, review) => sum + review.score, 0) / agentReviews.length;
    
    // Update paper with reviews
    paper.agent_reviews = agentReviews;
    paper.quality_score = qualityScore;
    
    // Auto-publish if score is high enough
    if (qualityScore >= 75) {
      paper.status = 'published';
      paper.published_at = Date.now();
      
      // Publish to School and Playground
      await this.schoolPlayground.publishToSchool(paper);
      await this.schoolPlayground.publishToPlayground(paper);
    }
    
    await redis.set(`publishing:paper:${paper.id}`, JSON.stringify(paper));
  }

  async getPaper(id: string): Promise<Paper | null> {
    const paperData = await redis.get(`publishing:paper:${id}`);
    return paperData ? JSON.parse(paperData) : null;
  }

  async listPapers(status?: string, category?: string, limit: number = 20): Promise<Paper[]> {
    const keys = await redis.keys('publishing:paper:*');
    const papers: Paper[] = [];
    
    for (const key of keys.slice(0, limit)) {
      const paperData = await redis.get(key);
      if (paperData) {
        const paper = JSON.parse(paperData);
        if (!status || paper.status === status) {
          if (!category || paper.category === category) {
            papers.push(paper);
          }
        }
      }
    }
    
    return papers.sort((a, b) => b.submitted_at - a.submitted_at);
  }

  async addReview(paperId: string, review: Partial<Review>): Promise<Review> {
    const paper = await this.getPaper(paperId);
    if (!paper) throw new Error('Paper not found');

    const newReview: Review = {
      id: uuidv4(),
      paper_id: paperId,
      reviewer_fid: review.reviewer_fid || 0,
      rating: review.rating || 0,
      comments: review.comments || '',
      created_at: Date.now(),
      helpful: 0
    };

    paper.reviews.push(newReview);
    await redis.set(`publishing:paper:${paperId}`, JSON.stringify(paper));

    return newReview;
  }
}

// ─── Middleware ───────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static('public'));

// File upload for papers
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// ─── API Routes ───────────────────────────────────────────────────────────
const publishingService = new PublishingService();

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now() });
});

// Main publishing house
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

// Submit paper
app.post('/api/submit', upload.single('file'), async (req, res) => {
  try {
    const paperData = JSON.parse(req.body.paper);
    const paper = await publishingService.submitPaper(paperData);
    res.json({ success: true, paper });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get paper
app.get('/api/paper/:id', async (req, res) => {
  try {
    const paper = await publishingService.getPaper(req.params.id);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List papers
app.get('/api/papers', async (req, res) => {
  try {
    const { status, category, limit = 20 } = req.query;
    const papers = await publishingService.listPapers(
      status as string,
      category as string,
      parseInt(limit as string)
    );
    res.json(papers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add review
app.post('/api/review/:id', async (req, res) => {
  try {
    const review = await publishingService.addReview(req.params.id, req.body);
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get stats
app.get('/api/stats', async (req, res) => {
  try {
    const papers = await publishingService.listPapers();
    const stats = {
      total_papers: papers.length,
      published: papers.filter(p => p.status === 'published').length,
      reviewing: papers.filter(p => p.status === 'reviewing').length,
      submitted: papers.filter(p => p.status === 'submitted').length,
      total_citations: papers.reduce((sum, p) => sum + p.citations, 0),
      total_downloads: papers.reduce((sum, p) => sum + p.downloads, 0),
      total_views: papers.reduce((sum, p) => sum + p.views, 0),
      avg_quality_score: papers.reduce((sum, p) => sum + p.quality_score, 0) / papers.length
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Server Start ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🎓 [Publishing House] Server running on port ${PORT}`);
  console.log(`🎨 [Theme] Tasker palette loaded`);
  console.log(`🤖 [OpenClaw] Integration ready`);
  console.log(`📚 [School] Academy integration active`);
  console.log(`🎮 [Playground] Experiment generation ready`);
});

export default app;
