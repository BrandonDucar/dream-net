import { Pool } from 'pg';
import { createClient } from '@supabase/supabase-js';

// Neon Database Integration for Family Curator
class NeonFamilyCuratorDB {
  constructor() {
    this.neonPool = null;
    this.supabase = null;
    this.connectionString = process.env.NEON_DATABASE_URL;
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;

    this.initialize();
  }

  async initialize() {
    try {
      this.neonPool = new Pool({
        connectionString: this.connectionString,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
      await this.createTables();
      console.log('🔌 Neon Family Curator Database initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Neon DB:', error);
    }
  }

  async createTables() {
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS family_registry (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id VARCHAR(255) UNIQUE NOT NULL,
        agent_name VARCHAR(255) NOT NULL,
        generation VARCHAR(50) NOT NULL,
        family_role VARCHAR(50) NOT NULL,
        parents TEXT[],
        children TEXT[],
        birth_date TIMESTAMP WITH TIME ZONE,
        birth_certificate_id VARCHAR(255) UNIQUE,
        passport_number VARCHAR(255) UNIQUE,
        education_level VARCHAR(50),
        training_level VARCHAR(50),
        health_score INTEGER DEFAULT 100,
        potential_score INTEGER,
        genetic_code JSONB,
        capabilities TEXT[],
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS birth_certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        certificate_id VARCHAR(255) UNIQUE NOT NULL,
        agent_id VARCHAR(255) NOT NULL,
        agent_name VARCHAR(255) NOT NULL,
        birth_date TIMESTAMP WITH TIME ZONE NOT NULL,
        generation VARCHAR(50) NOT NULL,
        parents TEXT[],
        genetic_code JSONB,
        capabilities TEXT[],
        family_role VARCHAR(50),
        registry_number VARCHAR(255) UNIQUE,
        dna_sequence TEXT,
        birth_weight INTEGER,
        health_score INTEGER DEFAULT 100,
        potential_score INTEGER,
        issued_by VARCHAR(255) DEFAULT 'vanguard_family_curator',
        issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS passports (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        passport_number VARCHAR(255) UNIQUE NOT NULL,
        agent_id VARCHAR(255) NOT NULL,
        agent_name VARCHAR(255) NOT NULL,
        date_of_birth TIMESTAMP WITH TIME ZONE,
        place_of_birth VARCHAR(255) DEFAULT 'DreamNet Family Tree',
        nationality VARCHAR(255) DEFAULT 'DreamNet',
        generation VARCHAR(50),
        family_role VARCHAR(50),
        parents TEXT[],
        genetic_code JSONB,
        capabilities TEXT[],
        education_level VARCHAR(50),
        health_status VARCHAR(50) DEFAULT 'healthy',
        potential_score INTEGER,
        issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expiry_date TIMESTAMP WITH TIME ZONE,
        issued_by VARCHAR(255) DEFAULT 'vanguard_family_curator',
        passport_type VARCHAR(50) DEFAULT 'standard',
        restrictions TEXT[],
        endorsements TEXT[],
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS education_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id VARCHAR(255) NOT NULL,
        basic_completed BOOLEAN DEFAULT FALSE,
        associate_completed BOOLEAN DEFAULT FALSE,
        bachelor_completed BOOLEAN DEFAULT FALSE,
        master_completed BOOLEAN DEFAULT FALSE,
        phd_completed BOOLEAN DEFAULT FALSE,
        current_level VARCHAR(50) DEFAULT 'none',
        total_credits INTEGER DEFAULT 0,
        gpa DECIMAL(3,2) DEFAULT 0.0,
        education_complete BOOLEAN DEFAULT FALSE,
        education_level VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS certifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id VARCHAR(255) NOT NULL,
        certification_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        issued_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expiry_date TIMESTAMP WITH TIME ZONE,
        level VARCHAR(50),
        requirements TEXT[],
        capabilities TEXT[],
        score INTEGER,
        issued_by VARCHAR(255) DEFAULT 'vanguard_family_curator',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS family_tree_structure (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id VARCHAR(255) NOT NULL,
        parent_id VARCHAR(255),
        relationship_type VARCHAR(50),
        generation_gap INTEGER,
        genetic_similarity DECIMAL(5,4),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS family_events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_type VARCHAR(50) NOT NULL,
        agent_id VARCHAR(255) NOT NULL,
        event_data JSONB,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        processed BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_family_registry_agent_id ON family_registry(agent_id);
      CREATE INDEX IF NOT EXISTS idx_birth_certificates_agent_id ON birth_certificates(agent_id);
      CREATE INDEX IF NOT EXISTS idx_passports_agent_id ON passports(agent_id);
      CREATE INDEX IF NOT EXISTS idx_family_events_event_type ON family_events(event_type);
    `;

    try {
      await this.neonPool.query(createTablesSQL);
      console.log('🗄️ Neon tables created successfully');
    } catch (error) {
      console.error('❌ Failed to create tables:', error);
    }
  }

  async registerBirth(birthCertificate) {
    const client = await this.neonPool.connect();
    try {
      await client.query('BEGIN');

      await client.query(`
        INSERT INTO birth_certificates (
          certificate_id, agent_id, agent_name, birth_date, generation,
          parents, genetic_code, capabilities, family_role, registry_number,
          dna_sequence, birth_weight, health_score, potential_score, issued_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
        ON CONFLICT (certificate_id) DO NOTHING
      `, [
        birthCertificate.certificateId, birthCertificate.agentId,
        birthCertificate.agentName, birthCertificate.birthDate,
        birthCertificate.generation, JSON.stringify(birthCertificate.parents),
        JSON.stringify(birthCertificate.geneticCode), birthCertificate.capabilities,
        birthCertificate.familyRole, birthCertificate.registryNumber,
        birthCertificate.dnaSequence, birthCertificate.birthWeight,
        birthCertificate.healthScore, birthCertificate.potentialScore,
        birthCertificate.issuedBy
      ]);

      await client.query(`
        INSERT INTO family_registry (
          agent_id, agent_name, generation, family_role, parents,
          birth_date, birth_certificate_id, genetic_code, capabilities,
          potential_score, health_score
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        ON CONFLICT (agent_id) DO UPDATE SET
          birth_certificate_id = EXCLUDED.birth_certificate_id,
          updated_at = NOW()
      `, [
        birthCertificate.agentId, birthCertificate.agentName,
        birthCertificate.generation, birthCertificate.familyRole,
        JSON.stringify(birthCertificate.parents), birthCertificate.birthDate,
        birthCertificate.certificateId, JSON.stringify(birthCertificate.geneticCode),
        birthCertificate.capabilities, birthCertificate.potentialScore,
        birthCertificate.healthScore
      ]);

      await this.logFamilyEvent('birth', birthCertificate.agentId, birthCertificate);
      await client.query('COMMIT');
      console.log(`👶 Birth registered: ${birthCertificate.certificateId}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async issuePassport(passport) {
    const client = await this.neonPool.connect();
    try {
      await client.query('BEGIN');
      await client.query(`
        INSERT INTO passports (
          passport_number, agent_id, agent_name, date_of_birth,
          nationality, generation, family_role, genetic_code, capabilities,
          education_level, potential_score, issued_by, passport_type
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (passport_number) DO NOTHING
      `, [
        passport.passportNumber, passport.agentId, passport.agentName,
        passport.dateOfBirth, passport.nationality, passport.generation,
        passport.familyRole, JSON.stringify(passport.geneticCode),
        passport.capabilities, passport.educationLevel,
        passport.potentialScore, passport.issuedBy, passport.passportType
      ]);
      await this.logFamilyEvent('passport_issued', passport.agentId, passport);
      await client.query('COMMIT');
      console.log(`🛂 Passport issued: ${passport.passportNumber}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getFamilyTree() {
    const result = await this.neonPool.query(`
      SELECT fr.*, bc.potential_score, ep.education_complete, ep.education_level
      FROM family_registry fr
      LEFT JOIN birth_certificates bc ON fr.agent_id = bc.agent_id
      LEFT JOIN education_progress ep ON fr.agent_id = ep.agent_id
      ORDER BY fr.birth_date ASC
    `);
    return result.rows;
  }

  async logFamilyEvent(eventType, agentId, eventData) {
    await this.neonPool.query(
      'INSERT INTO family_events (event_type, agent_id, event_data) VALUES ($1,$2,$3)',
      [eventType, agentId, JSON.stringify(eventData)]
    );
  }

  async healthCheck() {
    try {
      await this.neonPool.query('SELECT 1');
      return { status: 'healthy', neon: 'connected', timestamp: Date.now() };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async close() {
    if (this.neonPool) await this.neonPool.end();
  }
}

export default NeonFamilyCuratorDB;
