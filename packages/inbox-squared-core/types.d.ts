/**
 * Inbox² Core Types
 */
export interface RecipientResearch {
    email: string;
    name?: string;
    company?: string;
    facts: ResearchFact[];
    sources: string[];
    cachedAt: number;
    expiresAt: number;
}
export interface ResearchFact {
    fact: string;
    source: string;
    credibility: 'high' | 'medium' | 'low';
    date?: string;
}
export interface RelevantTopics {
    trendingKeywords: string[];
    industryTopics: string[];
    recentNews: NewsItem[];
    relevanceScore: number;
}
export interface NewsItem {
    title: string;
    url: string;
    publishedAt: string;
    source: string;
}
export interface GeoContext {
    location?: string;
    timezone?: string;
    localEvents?: LocalEvent[];
    culturalContext?: string[];
    optimalSendTime?: Date;
}
export interface LocalEvent {
    name: string;
    date: string;
    location: string;
    relevance: 'high' | 'medium' | 'low';
}
export interface EngagementMetrics {
    messageId: string;
    threadId?: string;
    opened: boolean;
    openedAt?: string;
    clicked: boolean;
    clickedAt?: string;
    replied: boolean;
    repliedAt?: string;
    bounced: boolean;
    unsubscribed: boolean;
}
export interface EmailDraft {
    id: string;
    leadId?: string;
    toEmail: string;
    subject: string;
    body: string;
    html?: string;
    variants?: EmailVariant[];
    research?: RecipientResearch;
    topics?: RelevantTopics;
    geoContext?: GeoContext;
    gmailDraftId?: string;
    gmailMessageId?: string;
    createdAt: number;
    metadata?: Record<string, unknown>;
}
export interface EmailVariant {
    id: string;
    type: 'subject' | 'body' | 'cta';
    value: string;
    tested: boolean;
    performance?: {
        opens: number;
        clicks: number;
        replies: number;
    };
}
export interface ContentTwin {
    platform: 'twitter' | 'linkedin' | 'landing';
    content: string;
    adapted: boolean;
}
export interface InboxSquaredConfig {
    gmail?: {
        clientId?: string;
        clientSecret?: string;
        refreshToken?: string;
    };
    research?: {
        enabled: boolean;
        cacheHours: number;
    };
    learning?: {
        enabled: boolean;
        minSampleSize: number;
    };
}
export interface DraftGenerationOptions {
    fromName: string;
    fromEmail: string;
    tone?: 'casual' | 'consultative' | 'executive';
    includeOptOut?: boolean;
    generateVariants?: boolean;
    generateContentTwins?: boolean;
}
