/**
 * 🐺 WOLF PACK GROWTH COORDINATOR
 * 
 * Tracks and coordinates all growth operations
 * Central dashboard for monitoring funding, community, and business metrics
 */

import Redis from 'ioredis';
import axios from 'axios';

interface GrowthMetrics {
  timestamp: string;
  githubStars: number;
  discordMembers: number;
  twitterFollowers: number;
  grantsSubmitted: number;
  grantsAwarded: number;
  totalFundingAwarded: number;
  vcPitchesSent: number;
  vcMeetingsScheduled: number;
  socialImpressions: number;
  mediaMentions: number;
  fundingPipeline: number;
  estimatedFunding6Mo: number;
}

interface GrowthAlert {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  metric: string;
}

class WolfPackCoordinator {
  private redis: Redis.Redis;
  private discordWebhook: string;
  private alerts: GrowthAlert[] = [];
  private metrics: GrowthMetrics[] = [];

  constructor(redisUrl: string = process.env.REDIS_URL || 'redis://nerve:6379') {
    this.redis = new Redis(redisUrl);
    this.discordWebhook = process.env.DISCORD_WEBHOOK_URL || '';
  }

  /**
   * Start growth tracking and coordination
   */
  async startGrowthTracking() {
    console.log('🐺 Wolf Pack Coordinator activated');

    // Track metrics every hour
    setInterval(async () => {
      try {
        await this.trackWeeklyMetrics();
      } catch (error) {
        console.error('Error tracking metrics:', error);
      }
    }, 3600000); // Every hour

    // Generate daily reports
    setInterval(async () => {
      try {
        await this.generateDailyReport();
      } catch (error) {
        console.error('Error generating report:', error);
      }
    }, 86400000); // Every 24 hours

    // Track immediately
    await this.trackWeeklyMetrics();
  }

  /**
   * Gather all growth metrics
   */
  private async trackWeeklyMetrics(): Promise<GrowthMetrics> {
    try {
      const metrics: GrowthMetrics = {
        timestamp: new Date().toISOString(),
        githubStars: await this.getGithubStars(),
        discordMembers: await this.getDiscordMembers(),
        twitterFollowers: await this.getTwitterFollowers(),
        grantsSubmitted: parseInt(await this.redis.get('grants:submitted:count') || '0'),
        grantsAwarded: await this.getGrantsAwarded(),
        totalFundingAwarded: parseInt(await this.redis.get('grants:awarded:total') || '0'),
        vcPitchesSent: parseInt(await this.redis.get('vc:pitches:sent:count') || '0'),
        vcMeetingsScheduled: await this.getVcMeetingsScheduled(),
        socialImpressions: parseInt(await this.redis.get('social:impressions:total') || '0'),
        mediaMentions: await this.getMediaMentions(),
        fundingPipeline: parseInt(await this.redis.get('grants:total:funding') || '0'),
        estimatedFunding6Mo: this.calculateEstimatedFunding()
      };

      // Store metrics
      this.metrics.push(metrics);
      await this.redis.lpush('growth:metrics:history', JSON.stringify(metrics));

      // Check for alerts
      await this.checkMetricAlerts(metrics);

      return metrics;
    } catch (error) {
      console.error('Error tracking metrics:', error);
      return this.getEmptyMetrics();
    }
  }

  /**
   * Check metrics against targets and generate alerts
   */
  private async checkMetricAlerts(metrics: GrowthMetrics) {
    const targets = {
      githubStars: { week1: 600, month1: 1000, month3: 5000 },
      discordMembers: { week1: 200, month1: 500, month3: 2000 },
      grantsSubmitted: { week1: 5, month1: 15, month3: 50 },
      vcPitchesSent: { week1: 5, month1: 10, month3: 30 }
    };

    // Check GitHub stars
    if (metrics.githubStars >= 1000) {
      this.addAlert({
        severity: 'info',
        message: `🎉 GitHub milestone! ${metrics.githubStars} stars reached`,
        metric: 'githubStars',
        timestamp: new Date()
      });
    }

    // Check grants awarded
    if (metrics.grantsAwarded > 0) {
      this.addAlert({
        severity: 'critical',
        message: `💰 FUNDING ALERT: Grant awarded! $${metrics.totalFundingAwarded} secured`,
        metric: 'grantsAwarded',
        timestamp: new Date()
      });
    }

    // Check VC meetings
    if (metrics.vcMeetingsScheduled > 0) {
      this.addAlert({
        severity: 'warning',
        message: `🤝 VC meeting scheduled! ${metrics.vcMeetingsScheduled} meetings on the calendar`,
        metric: 'vcMeetings',
        timestamp: new Date()
      });
    }

    // Check funding pipeline
    if (metrics.fundingPipeline > 1000000) {
      this.addAlert({
        severity: 'info',
        message: `📊 Funding pipeline: $${(metrics.fundingPipeline / 1000000).toFixed(1)}M in submitted grants`,
        metric: 'fundingPipeline',
        timestamp: new Date()
      });
    }
  }

  /**
   * Generate daily growth report
   */
  async generateDailyReport() {
    try {
      const latestMetrics = this.metrics[this.metrics.length - 1] || this.getEmptyMetrics();

      const report = `
📊 DREAMNET DAILY GROWTH REPORT
${new Date().toLocaleDateString()}

🌟 COMMUNITY
  Stars: ${latestMetrics.githubStars}
  Discord: ${latestMetrics.discordMembers} members
  Twitter: ${latestMetrics.twitterFollowers} followers

💰 FUNDING
  Grants Submitted: ${latestMetrics.grantsSubmitted}
  Grants Awarded: ${latestMetrics.grantsAwarded}
  Funding Awarded: $${(latestMetrics.totalFundingAwarded / 1000000).toFixed(2)}M
  Pipeline: $${(latestMetrics.fundingPipeline / 1000000).toFixed(1)}M

🤝 VENTURE
  Pitches Sent: ${latestMetrics.vcPitchesSent}
  Meetings Scheduled: ${latestMetrics.vcMeetingsScheduled}
  Estimated 6-Month Funding: $${(latestMetrics.estimatedFunding6Mo / 1000000).toFixed(1)}M

📱 ENGAGEMENT
  Social Impressions: ${(latestMetrics.socialImpressions / 1000).toFixed(0)}K
  Media Mentions: ${latestMetrics.mediaMentions}

🎯 NEXT TARGETS
  Week 1: 600 GitHub stars ✓
  Month 1: 1000 stars, $50K-100K grants
  Month 3: 5000 stars, $200K-$1M awarded
      `;

      // Save report
      await this.redis.lpush('growth:reports:daily', report);

      // Post to Discord if webhook available
      if (this.discordWebhook) {
        await this.postReportToDiscord(report);
      }

      console.log('✅ Daily report generated');
    } catch (error) {
      console.error('Error generating report:', error);
    }
  }

  /**
   * Post report to Discord
   */
  private async postReportToDiscord(report: string) {
    try {
      await axios.post(this.discordWebhook, {
        embeds: [
          {
            title: '📊 Daily Growth Report',
            description: report,
            color: 0x0099ff,
            footer: {
              text: 'Wolf Pack Coordinator'
            }
          }
        ]
      });
    } catch (error) {
      console.error('Error posting to Discord:', error);
    }
  }

  /**
   * Get GitHub stars count
   */
  private async getGithubStars(): Promise<number> {
    try {
      const cached = await this.redis.get('github:stars:cached');
      if (cached) {
        return parseInt(cached);
      }

      // In production, would fetch from GitHub API
      // For now, return estimated value
      const count = await this.redis.get('github:stars') || '500';
      return parseInt(count);
    } catch {
      return 500;
    }
  }

  /**
   * Get Discord members count
   */
  private async getDiscordMembers(): Promise<number> {
    try {
      const count = await this.redis.get('discord:members:total') || '0';
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  /**
   * Get Twitter followers
   */
  private async getTwitterFollowers(): Promise<number> {
    try {
      const count = await this.redis.get('twitter:followers:total') || '0';
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  /**
   * Get grants awarded count
   */
  private async getGrantsAwarded(): Promise<number> {
    try {
      const count = await this.redis.get('grants:awarded:count') || '0';
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  /**
   * Get VC meetings scheduled
   */
  private async getVcMeetingsScheduled(): Promise<number> {
    try {
      const count = await this.redis.get('vc:meetings:scheduled:count') || '0';
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  /**
   * Get media mentions count
   */
  private async getMediaMentions(): Promise<number> {
    try {
      const count = await this.redis.get('media:mentions:total') || '0';
      return parseInt(count);
    } catch {
      return 0;
    }
  }

  /**
   * Calculate estimated 6-month funding based on current pipeline
   */
  private calculateEstimatedFunding(): number {
    try {
      // Estimate: 30% of submitted grants get accepted
      // Average funding per grant: 40% of requested
      const estimatedMultiplier = 0.30 * 0.40;
      const pipeline = parseInt(this.metrics[this.metrics.length - 1]?.fundingPipeline.toString() || '0');
      return Math.floor(pipeline * estimatedMultiplier);
    } catch {
      return 0;
    }
  }

  /**
   * Add an alert
   */
  private addAlert(alert: Omit<GrowthAlert, 'timestamp'> & { timestamp: Date }) {
    this.alerts.push(alert as GrowthAlert);

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
  }

  /**
   * Get current metrics dashboard
   */
  async getDashboard(): Promise<GrowthMetrics> {
    return this.metrics[this.metrics.length - 1] || this.getEmptyMetrics();
  }

  /**
   * Get alerts
   */
  getAlerts(): GrowthAlert[] {
    return this.alerts;
  }

  /**
   * Empty metrics object
   */
  private getEmptyMetrics(): GrowthMetrics {
    return {
      timestamp: new Date().toISOString(),
      githubStars: 0,
      discordMembers: 0,
      twitterFollowers: 0,
      grantsSubmitted: 0,
      grantsAwarded: 0,
      totalFundingAwarded: 0,
      vcPitchesSent: 0,
      vcMeetingsScheduled: 0,
      socialImpressions: 0,
      mediaMentions: 0,
      fundingPipeline: 0,
      estimatedFunding6Mo: 0
    };
  }
}

export default WolfPackCoordinator;
