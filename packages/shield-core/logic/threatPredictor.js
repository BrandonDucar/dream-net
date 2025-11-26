/**
 * Predictive Threat Modeling
 * Predicts future attacks based on patterns and historical data
 */
import { ShieldStore } from "../store/shieldStore";
/**
 * Threat Predictor
 * Uses time-series forecasting and pattern recognition to predict threats
 */
export class ThreatPredictor {
    predictionHistory = [];
    maxHistorySize = 1000;
    /**
     * Predict future threats based on patterns
     */
    async predictThreats() {
        const predictions = [];
        // Get recent threats for pattern analysis
        const recentThreats = ShieldStore.listRecentThreats(1000);
        const threatPatterns = this.analyzeThreatPatterns(recentThreats);
        // Predict based on patterns
        for (const pattern of threatPatterns) {
            const prediction = this.predictFromPattern(pattern);
            if (prediction && prediction.probability > 0.3) {
                predictions.push(prediction);
            }
        }
        // Store predictions
        this.predictionHistory.push(...predictions);
        if (this.predictionHistory.length > this.maxHistorySize) {
            this.predictionHistory = this.predictionHistory.slice(-this.maxHistorySize);
        }
        return predictions;
    }
    /**
     * Identify vulnerable components before they're attacked
     */
    identifyVulnerableComponents() {
        const recentThreats = ShieldStore.listRecentThreats(500);
        const componentThreatCounts = new Map();
        // Count threats per component
        for (const threat of recentThreats) {
            const target = threat.target || "unknown";
            componentThreatCounts.set(target, (componentThreatCounts.get(target) || 0) + 1);
        }
        // Identify components with high threat counts but no recent blocks
        const vulnerable = [];
        for (const [component, count] of componentThreatCounts.entries()) {
            const blockedThreats = recentThreats.filter(t => t.target === component && t.blocked).length;
            // If many threats but few blocks, component is vulnerable
            if (count > 5 && blockedThreats / count < 0.5) {
                vulnerable.push(component);
            }
        }
        return vulnerable;
    }
    /**
     * Recommend proactive security measures
     */
    recommendProactiveMeasures() {
        const recommendations = [];
        const predictions = this.predictionHistory.slice(-100); // Last 100 predictions
        // Analyze prediction accuracy
        const highProbabilityPredictions = predictions.filter(p => p.probability > 0.7);
        if (highProbabilityPredictions.length > 10) {
            recommendations.push("Increase monitoring frequency for predicted threat types");
        }
        // Check for vulnerable components
        const vulnerable = this.identifyVulnerableComponents();
        if (vulnerable.length > 0) {
            recommendations.push(`Strengthen defenses for vulnerable components: ${vulnerable.join(", ")}`);
        }
        // Check threat trends
        const trends = this.forecastThreatTrends();
        const increasingTrends = trends.filter(t => t.trend === "increasing");
        if (increasingTrends.length > 0) {
            recommendations.push(`Prepare for increasing ${increasingTrends.map(t => t.threatType).join(", ")} threats`);
        }
        return recommendations;
    }
    /**
     * Forecast threat trends
     */
    forecastThreatTrends() {
        const recentThreats = ShieldStore.listRecentThreats(1000);
        const trends = [];
        // Group threats by type and time
        const threatsByType = new Map();
        for (const threat of recentThreats) {
            if (!threatsByType.has(threat.type)) {
                threatsByType.set(threat.type, []);
            }
            threatsByType.get(threat.type).push(threat);
        }
        // Analyze trends for each threat type
        for (const [type, threats] of threatsByType.entries()) {
            // Split into time periods (recent vs older)
            const now = Date.now();
            const recent = threats.filter(t => now - t.detectedAt < 24 * 60 * 60 * 1000); // Last 24 hours
            const older = threats.filter(t => now - t.detectedAt >= 24 * 60 * 60 * 1000 && now - t.detectedAt < 7 * 24 * 60 * 60 * 1000); // Last week
            const recentRate = recent.length / 24; // Per hour
            const olderRate = older.length / (7 * 24); // Per hour
            let trend;
            let changeRate = 0;
            if (recentRate > olderRate * 1.2) {
                trend = "increasing";
                changeRate = ((recentRate - olderRate) / olderRate) * 100;
            }
            else if (recentRate < olderRate * 0.8) {
                trend = "decreasing";
                changeRate = ((olderRate - recentRate) / olderRate) * 100;
            }
            else {
                trend = "stable";
                changeRate = 0;
            }
            // Forecast future threat levels
            const forecast = [];
            const avgLevel = this.calculateAverageThreatLevel(threats);
            if (trend === "increasing") {
                forecast.push(avgLevel, this.escalateLevel(avgLevel), this.escalateLevel(this.escalateLevel(avgLevel)));
            }
            else if (trend === "decreasing") {
                forecast.push(avgLevel, this.deescalateLevel(avgLevel), this.deescalateLevel(this.deescalateLevel(avgLevel)));
            }
            else {
                forecast.push(avgLevel, avgLevel, avgLevel);
            }
            trends.push({
                threatType: type,
                trend,
                changeRate,
                forecast,
            });
        }
        return trends;
    }
    /**
     * Analyze threat patterns
     */
    analyzeThreatPatterns(threats) {
        const patterns = new Map();
        for (const threat of threats) {
            const key = `${threat.type}-${threat.level}`;
            if (!patterns.has(key)) {
                patterns.set(key, {
                    type: threat.type,
                    level: threat.level,
                    count: 0,
                    sources: new Set(),
                });
            }
            const pattern = patterns.get(key);
            pattern.count++;
            if (threat.source) {
                pattern.sources.add(threat.source);
            }
        }
        return Array.from(patterns.values()).map(p => ({
            type: p.type,
            level: p.level,
            frequency: p.count / threats.length,
            sources: Array.from(p.sources),
        }));
    }
    /**
     * Predict threat from pattern
     */
    predictFromPattern(pattern) {
        // High frequency patterns are more likely to recur
        if (pattern.frequency < 0.05) {
            return null; // Too rare to predict
        }
        const probability = Math.min(0.95, pattern.frequency * 2); // Scale frequency to probability
        const timeframe = pattern.frequency > 0.2 ? "immediate" : pattern.frequency > 0.1 ? "short-term" : "medium-term";
        const confidence = Math.min(0.9, pattern.frequency * 3);
        return {
            threatType: pattern.type,
            threatLevel: pattern.level,
            probability,
            timeframe,
            confidence,
            recommendedActions: this.getRecommendedActions(pattern.type, pattern.level),
            vulnerableComponents: this.identifyVulnerableComponents(),
        };
    }
    /**
     * Get recommended actions for threat type/level
     */
    getRecommendedActions(type, level) {
        const actions = [];
        if (level === "critical" || level === "extreme") {
            actions.push("Deploy active counter-attack measures");
            actions.push("Increase monitoring frequency");
            actions.push("Prepare automated response systems");
        }
        else if (level === "high") {
            actions.push("Strengthen defenses for target components");
            actions.push("Deploy honeypots");
        }
        else {
            actions.push("Monitor for pattern changes");
            actions.push("Gather intelligence");
        }
        if (type === "ddos") {
            actions.push("Prepare traffic redirection");
            actions.push("Scale up DDoS mitigation");
        }
        else if (type === "intrusion") {
            actions.push("Review access controls");
            actions.push("Deploy deception networks");
        }
        else if (type === "data-exfiltration") {
            actions.push("Monitor data access patterns");
            actions.push("Implement data loss prevention");
        }
        return actions;
    }
    /**
     * Calculate average threat level
     */
    calculateAverageThreatLevel(threats) {
        if (threats.length === 0)
            return "low";
        const levelValues = {
            low: 1,
            medium: 2,
            high: 3,
            critical: 4,
            extreme: 5,
        };
        const sum = threats.reduce((acc, t) => acc + levelValues[t.level], 0);
        const avg = sum / threats.length;
        if (avg >= 4.5)
            return "extreme";
        if (avg >= 3.5)
            return "critical";
        if (avg >= 2.5)
            return "high";
        if (avg >= 1.5)
            return "medium";
        return "low";
    }
    /**
     * Escalate threat level
     */
    escalateLevel(level) {
        const levels = ["low", "medium", "high", "critical", "extreme"];
        const index = levels.indexOf(level);
        return levels[Math.min(levels.length - 1, index + 1)];
    }
    /**
     * Deescalate threat level
     */
    deescalateLevel(level) {
        const levels = ["low", "medium", "high", "critical", "extreme"];
        const index = levels.indexOf(level);
        return levels[Math.max(0, index - 1)];
    }
    /**
     * Get prediction history
     */
    getPredictionHistory() {
        return [...this.predictionHistory];
    }
}
// Export singleton instance
export const threatPredictor = new ThreatPredictor();
