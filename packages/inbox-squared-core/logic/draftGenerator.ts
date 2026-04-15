/**
 * Enhanced Draft Generator
 * Combines all Inbox² layers to create intelligent email drafts
 */

import type {
  EmailDraft,
  RecipientResearch,
  RelevantTopics,
  GeoContext,
  EmailVariant,
  ContentTwin,
} from '../types';
import { researchEngine } from './researchEngine';
import { relevanceEngine } from './relevanceEngine';
import { geoAwareness } from './geoAwareness';
import { learningLoop } from './learningLoop';

export interface DraftGenerationOptions {
  fromName: string;
  fromEmail: string;
  tone?: 'casual' | 'consultative' | 'executive';
  includeOptOut?: boolean;
  generateVariants?: boolean;
  generateContentTwins?: boolean;
}

export class DraftGenerator {
  /**
   * Generate intelligent email draft using all Inbox² layers
   */
  async generateDraft(
    recipientEmail: string,
    recipientName?: string,
    recipientCompany?: string,
    options: DraftGenerationOptions
  ): Promise<EmailDraft> {
    // Layer 1: Research
    const research = await researchEngine.researchRecipient(
      recipientEmail,
      recipientName,
      recipientCompany
    );

    // Layer 2: Relevance
    const topics = await relevanceEngine.findRelevantTopics(
      recipientEmail,
      recipientCompany,
      recipientCompany
    );

    // Layer 3: Geo Awareness
    const geoContext = await geoAwareness.getGeoContext(
      recipientEmail,
      recipientName,
      recipientCompany
    );

    // Generate subject line
    const subject = this.generateSubject(
      recipientName,
      recipientCompany,
      topics,
      research
    );

    // Generate body
    const body = this.generateBody(
      recipientName,
      recipientCompany,
      research,
      topics,
      geoContext,
      options
    );

    // Generate HTML version
    const html = this.generateHTML(body);

    // Generate variants if requested
    const variants = options.generateVariants
      ? this.generateVariants(subject, body, options)
      : undefined;

    // Generate content twins if requested
    const contentTwins = options.generateContentTwins
      ? this.generateContentTwins(subject, body)
      : undefined;

    const draft: EmailDraft = {
      id: `draft-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      toEmail: recipientEmail,
      subject,
      body,
      html,
      variants,
      research,
      topics,
      geoContext,
      createdAt: Date.now(),
      metadata: {
        tone: options.tone || 'consultative',
        contentTwins,
      },
    };

    return draft;
  }

  /**
   * Generate subject line
   */
  private generateSubject(
    name?: string,
    company?: string,
    topics?: RelevantTopics,
    research?: RecipientResearch
  ): string {
    // Use learning loop for best performing patterns
    const bestSubjectPattern = learningLoop.getBestPattern('subject_line');

    if (bestSubjectPattern) {
      return bestSubjectPattern.replace('{{name}}', name || 'there');
    }

    // Default: Use company/research for personalization
    if (company) {
      return `Quick question about ${company}`;
    }

    if (topics?.trendingKeywords.length) {
      return `Thoughts on ${topics.trendingKeywords[0]}?`;
    }

    return 'DreamNet: A living digital network on Base';
  }

  /**
   * Generate email body
   */
  private generateBody(
    name?: string,
    company?: string,
    research: RecipientResearch,
    topics: RelevantTopics,
    geoContext: GeoContext,
    options: DraftGenerationOptions
  ): string {
    const greeting = name ? `Hi ${name},` : 'Hello,';
    const tone = options.tone || 'consultative';

    let body = `${greeting}\n\n`;

    // Add research facts (3-5 facts)
    if (research.facts.length > 0) {
      body += `I noticed that ${research.facts[0].fact.toLowerCase()}.\n\n`;
    }

    // Add relevance hook
    if (topics.trendingKeywords.length > 0) {
      body += `Given the recent focus on ${topics.trendingKeywords[0]}, I thought you might be interested in DreamNet — a biomimetic, multi-agent network running on Base.\n\n`;
    }

    // Main message (tone-adjusted)
    if (tone === 'casual') {
      body += `We're building something cool: a living digital organism with swarm agents, a DreamVault of blueprints, and an emerging Agent Exchange economy.\n\n`;
    } else if (tone === 'executive') {
      body += `DreamNet represents a paradigm shift in decentralized infrastructure: a biomimetic network architecture featuring autonomous swarm agents, a comprehensive DreamVault knowledge repository, and an innovative Agent Exchange marketplace.\n\n`;
    } else {
      // consultative (default)
      body += `We're building a living digital organism:\n`;
      body += `- Swarm agents (Wolf Pack, FieldLayer, DreamTank)\n`;
      body += `- A DreamVault of blueprints and rituals\n`;
      body += `- An emerging Agent Exchange economy\n\n`;
    }

    // CTA
    body += `I'd love to share a short overview and see if there's a fit.\n\n`;

    // Opt-out line
    if (options.includeOptOut !== false) {
      body += `If this isn't relevant, feel free to ignore or let me know.\n\n`;
    }

    // Signature
    body += `Best,\n${options.fromName}\n${options.fromEmail}`;

    return body;
  }

  /**
   * Generate HTML version
   */
  private generateHTML(body: string): string {
    // Convert plain text to HTML
    return body
      .split('\n')
      .map((line) => {
        if (line.trim() === '') return '<br>';
        if (line.startsWith('- ')) {
          return `<li>${line.substring(2)}</li>`;
        }
        return `<p>${line}</p>`;
      })
      .join('\n');
  }

  /**
   * Generate A/B variants
   */
  private generateVariants(
    subject: string,
    body: string,
    options: DraftGenerationOptions
  ): EmailVariant[] {
    const variants: EmailVariant[] = [];

    // Subject variants
    variants.push({
      id: 'subject-1',
      type: 'subject',
      value: subject,
      tested: false,
    });

    // Alternative subject
    variants.push({
      id: 'subject-2',
      type: 'subject',
      value: `Re: ${subject}`,
      tested: false,
    });

    return variants;
  }

  /**
   * Generate content twins (social/landing copy)
   */
  private generateContentTwins(subject: string, body: string): ContentTwin[] {
    const twins: ContentTwin[] = [];

    // Twitter version
    twins.push({
      platform: 'twitter',
      content: `${subject}\n\n${body.substring(0, 200)}...`,
      adapted: true,
    });

    // LinkedIn version
    twins.push({
      platform: 'linkedin',
      content: `${subject}\n\n${body}`,
      adapted: true,
    });

    return twins;
  }
}

export const draftGenerator = new DraftGenerator();

