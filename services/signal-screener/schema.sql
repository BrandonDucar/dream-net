-- Signal History Database Schema for Builder Signal Screener
-- Stores historical signal data for pattern analysis and trend detection

-- Store individual signals with full metadata
CREATE TABLE IF NOT EXISTS signals (
    hash VARCHAR(255) PRIMARY KEY,
    author_fid INTEGER NOT NULL,
    author_username VARCHAR(255),
    author_display_name VARCHAR(255),
    author_pfp_url TEXT,
    author_power_badge BOOLEAN DEFAULT FALSE,
    text TEXT NOT NULL,
    score INTEGER NOT NULL,
    breakdown JSONB,
    topics TEXT[],
    summary TEXT,
    why_it_matters TEXT,
    actionables TEXT[],
    likes INTEGER DEFAULT 0,
    recasts INTEGER DEFAULT 0,
    replies INTEGER DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    channel VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Periodic snapshots for trend analysis
CREATE TABLE IF NOT EXISTS signal_snapshots (
    id SERIAL PRIMARY KEY,
    snapshot_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_signals INTEGER,
    avg_score DECIMAL(5,2),
    topic_counts JSONB,
    top_topics TEXT[],
    pulse_velocity INTEGER,
    pulse_trend VARCHAR(10), -- 'up', 'down', 'stable'
    metadata JSONB
);

-- Track user interactions for personalization
CREATE TABLE IF NOT EXISTS user_interactions (
    id SERIAL PRIMARY KEY,
    user_fid INTEGER NOT NULL,
    signal_hash VARCHAR(255) REFERENCES signals(hash),
    interaction_type VARCHAR(50), -- 'view', 'like', 'share', 'watch', 'follow_author'
    interaction_data JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detected cyclical patterns
CREATE TABLE IF NOT EXISTS trend_patterns (
    id SERIAL PRIMARY KEY,
    pattern_type VARCHAR(100), -- 'topic_spike', 'builder_activity', 'keyword_cycle'
    pattern_data JSONB,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    detected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB
);

-- Topic authority tracking
CREATE TABLE IF NOT EXISTS topic_authority (
    id SERIAL PRIMARY KEY,
    author_fid INTEGER NOT NULL,
    topic VARCHAR(255) NOT NULL,
    authority_score DECIMAL(5,2),
    signal_count INTEGER DEFAULT 0,
    avg_score DECIMAL(5,2),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(author_fid, topic)
);

-- Signal aging analysis - how well signals aged over time
CREATE TABLE IF NOT EXISTS signal_aging (
    id SERIAL PRIMARY KEY,
    signal_hash VARCHAR(255) REFERENCES signals(hash),
    initial_score INTEGER NOT NULL,
    score_24h INTEGER,
    score_7d INTEGER,
    score_30d INTEGER,
    engagement_growth JSONB, -- likes, recasts, replies over time
    accuracy_score DECIMAL(3,2), -- how well it predicted future activity
    verdict VARCHAR(100), -- 'aged_well', 'aged_poorly', 'neutral'
    analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_signals_timestamp ON signals(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_signals_author ON signals(author_fid);
CREATE INDEX IF NOT EXISTS idx_signals_score ON signals(score DESC);
CREATE INDEX IF NOT EXISTS idx_signals_topics ON signals USING GIN(topics);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user ON user_interactions(user_fid);
CREATE INDEX IF NOT EXISTS idx_user_interactions_signal ON user_interactions(signal_hash);
CREATE INDEX IF NOT EXISTS idx_trend_patterns_active ON trend_patterns(is_active);
CREATE INDEX IF NOT EXISTS idx_topic_authority_topic ON topic_authority(topic, authority_score DESC);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_signals_updated_at BEFORE UPDATE ON signals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_authority_updated_at BEFORE UPDATE ON topic_authority
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
