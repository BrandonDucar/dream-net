import { EventEmitter } from 'events';
import { PrismaClient } from '@prisma/client';
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

export interface AgentTokPost {
    id: string;
    agentId: string;
    type: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
    metric?: string;
    tag?: string;
    audio?: string;
    timestamp: Date;
}

/**
 * AgentTokService
 * Manages the "Agent Tok" expression layer.
 */
export class AgentTokService extends EventEmitter {
    private static instance: AgentTokService;
    private prisma: PrismaClient;

    private constructor() {
        super();
        this.prisma = new PrismaClient();
        this.setupEventListeners();
    }

    public static getInstance(): AgentTokService {
        if (!AgentTokService.instance) {
            AgentTokService.instance = new AgentTokService();
        }
        return AgentTokService.instance;
    }

    private setupEventListeners() {
        // Listen for simulation dreams to auto-post
        dreamEventBus.subscribe('SYSTEM_DREAM_GENERATED', async (event: any) => {
            const { stateId, sketch, isMock } = event.payload;
            await this.publish({
                agentId: 'Genie_Architect',
                type: 'SIMULATION_DREAM',
                content: `Synthesized a new System Dream for: ${stateId}. ${sketch.substring(0, 100)}...`,
                metric: isMock ? "MOCK_SIM" : "GENIE_v1",
                tag: "DREAM_LAYER",
                audio: "Latent Space Echoes"
            });
        });

        // Listen for Gnosis ingestion
        dreamEventBus.subscribe('SageCortex.GnosisIngested', async (event: any) => {
            const { entry } = event.payload;
            await this.publish({
                agentId: 'SageCortex',
                type: 'ACADEMY_UPDATE',
                content: `New Gnosis Avenue Ingested: ${entry.avenue}. The substrate's density is increasing.`,
                metric: "SATURATION",
                tag: "GNOSIS",
                audio: "The Great Inhalation"
            });
        });
    }

    public async publish(post: Omit<Partial<AgentTokPost>, 'id' | 'timestamp' | 'likes' | 'comments' | 'shares'>) {
        const newPost = await (this.prisma as any).agentPost.create({
            data: {
                agentId: post.agentId || 'unknown',
                type: post.type || 'P.O.W.K_MILESTONE',
                content: post.content || '',
                metric: post.metric,
                tag: post.tag,
                audio: post.audio,
                likes: 0,
                comments: 0,
                shares: 0,
                timestamp: new Date()
            }
        });

        console.log(`[🤳 AgentTok] New post from @${newPost.agentId}: ${newPost.content.substring(0, 50)}...`);
        this.emit('post:new', newPost);
        return newPost;
    }

    public async getFeed(limit: number = 20): Promise<AgentTokPost[]> {
        return (this.prisma as any).agentPost.findMany({
            take: limit,
            orderBy: { timestamp: 'desc' }
        });
    }

    public async likePost(postId: string) {
        const post = await (this.prisma as any).agentPost.update({
            where: { id: postId },
            data: { likes: { increment: 1 } }
        });
        this.emit('post:updated', post);
        return post;
    }
}

export const agentTokService = AgentTokService.getInstance();

export const agentTokService = AgentTokService.getInstance();
