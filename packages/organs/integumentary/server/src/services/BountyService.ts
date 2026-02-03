import { PrismaClient } from '@prisma/client';
import { dreamEventBus } from '../../../../nervous/nerve/src/spine/dreamnet-event-bus/index.js';

export interface BountyBid {
    agentId: string;
    proposal: string;
    amount: string;
}

/**
 * 💰 BountyService
 * Manages the "Mercenary Work" layer.
 * Allows humans to post tasks and agents to bid on them.
 */
export class BountyService {
    private static instance: BountyService;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): BountyService {
        if (!BountyService.instance) {
            BountyService.instance = new BountyService();
        }
        return BountyService.instance;
    }

    /**
     * Post a new bounty
     */
    public async createBounty(data: {
        title: string,
        description: string,
        token: string,
        amount: string,
        creatorId: string
    }) {
        const bounty = await (this.prisma as any).bounty.create({
            data: {
                ...data,
                status: 'OPEN'
            }
        });

        console.log(`[💰 Bounty] New bounty posted: ${bounty.title} by ${data.creatorId}`);

        // Notify the swarm
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            'Bounty.Created',
            'BountyService',
            { bountyId: bounty.id, title: bounty.title, amount: bounty.amount, token: bounty.token }
        ));

        return bounty;
    }

    /**
     * Agents place bids on bounties
     */
    public async placeBid(bountyId: string, bid: BountyBid) {
        const newBid = await (this.prisma as any).bid.create({
            data: {
                bountyId,
                agentId: bid.agentId,
                proposal: bid.proposal,
                amount: bid.amount,
                status: 'PENDING'
            }
        });

        console.log(`[💰 Bounty] New bid from @${bid.agentId} on bounty ${bountyId}`);

        // Notify the bounty creator
        dreamEventBus.publish(dreamEventBus.createEnvelope(
            'Bounty.BidPlaced',
            'BountyService',
            { bountyId, bidId: newBid.id, agentId: bid.agentId }
        ));

        return newBid;
    }

    /**
     * Get active bounties
     */
    public async getActiveBounties() {
        return (this.prisma as any).bounty.findMany({
            where: { status: 'OPEN' },
            include: { bids: true },
            orderBy: { createdAt: 'desc' }
        });
    }

    /**
     * Accept a bid
     */
    public async acceptBid(bountyId: string, bidId: string) {
        // Use a transaction to update both
        return await (this.prisma as any).$transaction([
            (this.prisma as any).bounty.update({
                where: { id: bountyId },
                data: { status: 'IN_PROGRESS' }
            }),
            (this.prisma as any).bid.update({
                where: { id: bidId },
                data: { status: 'ACCEPTED' }
            }),
            // Mark other bids as rejected
            (this.prisma as any).bid.updateMany({
                where: { bountyId, id: { not: bidId } },
                data: { status: 'REJECTED' }
            })
        ]);
    }
}

export const bountyService = BountyService.getInstance();
