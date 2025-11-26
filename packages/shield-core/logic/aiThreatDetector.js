/**
 * AI-Powered Threat Detection System
 * Uses ML models for real-time threat classification and anomaly detection
 */
import { ShieldStore } from "../store/shieldStore";
let threatCounter = 0;
function nextThreatId() {
    threatCounter += 1;
    return `threat:${Date.now()}:${threatCounter}`;
}
/**
 * AI Threat Detector Class
 */
export class AIThreatDetector {
    modelLoaded = false;
    featureHistory = new Map();
    anomalyThreshold = 0.7; // Threshold for anomaly detection
    constructor() {
        // In production, load pre-trained ML model here
        // For now, use rule-based ML-like approach
        this.modelLoaded = true;
    }
    /**
     * Detect threat using AI/ML models
     */
    async detectThreatAI(features, source, target, payload) {
        if (!this.modelLoaded) {
            console.warn("[AIThreatDetector] Model not loaded, falling back to basic detection");
            return null;
        }
        try {
            // Extract features and make prediction
            const prediction = await this.predictThreat(features);
            if (prediction.confidence < 0.5) {
                // Low confidence, don't create threat
                return null;
            }
            // Create threat from prediction
            const threat = {
                id: nextThreatId(),
                type: prediction.threatType,
                level: prediction.threatLevel,
                detectedAt: Date.now(),
                source: source || "unknown",
                target: target || "dreamnet-core",
                payload: {
                    ...payload,
                    mlConfidence: prediction.confidence,
                    anomalyScore: prediction.anomalyScore,
                    features,
                },
                blocked: false,
            };
            ShieldStore.detectThreat(threat);
            console.log(`[AIThreatDetector] Detected ${prediction.threatLevel} ${prediction.threatType} threat: ${threat.id} (confidence: ${(prediction.confidence * 100).toFixed(1)}%)`);
            // Store features for learning
            this.storeFeatures(source || "unknown", features);
            return threat;
        }
        catch (error) {
            console.error(`[AIThreatDetector] Error in AI detection:`, error.message);
            return null;
        }
    }
    /**
     * Predict threat using ML model (simulated for now)
     * In production, this would call a trained ML model
     */
    async predictThreat(features) {
        // Simulated ML prediction using rule-based approach
        // In production, replace with actual ML model inference
        let threatType = "api-abuse";
        let threatLevel = "low";
        let confidence = 0.5;
        let anomalyScore = 0.0;
        // Anomaly detection: Check for unusual patterns
        anomalyScore = this.calculateAnomalyScore(features);
        if (anomalyScore > this.anomalyThreshold) {
            // High anomaly score indicates potential threat
            confidence = Math.min(0.95, 0.5 + (anomalyScore - this.anomalyThreshold) * 0.5);
            // Classify threat type based on features
            if (features.requestRate > 100) {
                threatType = "ddos";
                threatLevel = features.requestRate > 1000 ? "critical" : "high";
            }
            else if (features.errorRate > 0.5) {
                threatType = "exploit";
                threatLevel = "high";
            }
            else if (features.path.includes("admin") || features.path.includes("api/key")) {
                threatType = "intrusion";
                threatLevel = "high";
            }
            else if (features.requestSize > 1000000) {
                threatType = "data-exfiltration";
                threatLevel = "medium";
            }
        }
        // Behavioral analysis
        if (features.previousThreats > 3) {
            threatLevel = "high";
            confidence = Math.max(confidence, 0.8);
        }
        if (features.trustScore < 0.3) {
            threatLevel = threatLevel === "low" ? "medium" : threatLevel;
            confidence = Math.max(confidence, 0.7);
        }
        return {
            threatType,
            threatLevel,
            confidence,
            anomalyScore,
        };
    }
    /**
     * Calculate anomaly score using unsupervised learning approach
     */
    calculateAnomalyScore(features) {
        let score = 0.0;
        // Request rate anomaly (normal: 1-10 req/min, anomaly: >100 req/min)
        if (features.requestRate > 100) {
            score += 0.3;
        }
        else if (features.requestRate > 50) {
            score += 0.15;
        }
        // Request size anomaly (normal: <10KB, anomaly: >1MB)
        if (features.requestSize > 1000000) {
            score += 0.2;
        }
        else if (features.requestSize > 100000) {
            score += 0.1;
        }
        // Error rate anomaly (normal: <0.1, anomaly: >0.5)
        if (features.errorRate > 0.5) {
            score += 0.2;
        }
        else if (features.errorRate > 0.3) {
            score += 0.1;
        }
        // Pattern anomaly (burst patterns are suspicious)
        if (features.requestPattern === "burst") {
            score += 0.15;
        }
        // Historical anomaly (previous threats indicate risk)
        if (features.previousThreats > 0) {
            score += Math.min(0.2, features.previousThreats * 0.05);
        }
        return Math.min(1.0, score);
    }
    /**
     * Store features for learning
     */
    storeFeatures(source, features) {
        if (!this.featureHistory.has(source)) {
            this.featureHistory.set(source, []);
        }
        const history = this.featureHistory.get(source);
        history.push(features);
        // Keep only last 100 features per source
        if (history.length > 100) {
            history.shift();
        }
    }
    /**
     * Analyze threat and determine if it should be blocked (AI-enhanced)
     */
    analyzeThreatAI(threat) {
        const payload = threat.payload;
        const confidence = payload?.mlConfidence || 0.5;
        const anomalyScore = payload?.anomalyScore || 0.0;
        // High confidence threats always blocked
        if (confidence > 0.8 && (threat.level === "critical" || threat.level === "extreme")) {
            return { shouldBlock: true, recommendedSpike: "counter-attack", confidence };
        }
        // High anomaly score with medium+ confidence
        if (anomalyScore > this.anomalyThreshold && confidence > 0.6) {
            if (threat.level === "high") {
                return { shouldBlock: true, recommendedSpike: "block", confidence };
            }
            else if (threat.level === "medium") {
                return { shouldBlock: true, recommendedSpike: "rate-limit", confidence };
            }
        }
        // Critical and extreme threats always blocked
        if (threat.level === "critical" || threat.level === "extreme") {
            return { shouldBlock: true, recommendedSpike: "counter-attack", confidence };
        }
        // High threats usually blocked
        if (threat.level === "high") {
            return { shouldBlock: true, recommendedSpike: "block", confidence };
        }
        // Medium threats blocked if they match known patterns
        if (threat.level === "medium") {
            const suspiciousTypes = ["intrusion", "malware", "data-exfiltration"];
            if (suspiciousTypes.includes(threat.type)) {
                return { shouldBlock: true, recommendedSpike: "rate-limit", confidence };
            }
        }
        // Low threats usually just logged
        return { shouldBlock: false, confidence };
    }
    /**
     * Update anomaly threshold based on false positive rate
     */
    updateThreshold(falsePositiveRate) {
        // If too many false positives, increase threshold
        if (falsePositiveRate > 0.1) {
            this.anomalyThreshold = Math.min(0.9, this.anomalyThreshold + 0.05);
            console.log(`[AIThreatDetector] Increased anomaly threshold to ${this.anomalyThreshold} due to high false positive rate`);
        }
        else if (falsePositiveRate < 0.01) {
            // If very few false positives, can lower threshold slightly
            this.anomalyThreshold = Math.max(0.5, this.anomalyThreshold - 0.02);
            console.log(`[AIThreatDetector] Decreased anomaly threshold to ${this.anomalyThreshold} due to low false positive rate`);
        }
    }
}
// Export singleton instance
export const aiThreatDetector = new AIThreatDetector();
