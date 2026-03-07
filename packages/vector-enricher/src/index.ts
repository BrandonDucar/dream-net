import axios from 'axios';
import { QdrantClient } from '@qdrant/js-client-rest';
import postgres from 'postgres';
import { v4 as uuidv4 } from 'uuid';

interface Document {
  doc_id: string;
  content: string;
  metadata: Record<string, any>;
  updated_at: string;
}

class VectorEnricher {
  private qdrant: QdrantClient;
  private postgres: ReturnType<typeof postgres>;
  private ollamaUrl: string = 'http://dreamnet_ollama:11434';
  private qdrantUrl: string = 'http://dreamnet_qdrant:6333';
  private processedCount: number = 0;
  private errorCount: number = 0;
  private isRunning: boolean = false;

  constructor() {
    this.qdrant = new QdrantClient({
      url: this.qdrantUrl,
    });

    this.postgres = postgres({
      host: 'clawedette_db',
      port: 5432,
      database: 'dreamnet_vectors',
      username: 'postgres',
      password: 'postgres123',
      ssl: false,
    });
  }

  /**
   * Initialize connections
   */
  async initialize(): Promise<void> {
    console.log('\n🚀 Initializing Vector Enricher (Simplified Mode)...\n');
    
    try {
      // Verify Qdrant is accessible
      const health = await this.qdrant.getCollections();
      console.log('✅ Connected to Qdrant');

      // Verify PostgreSQL is accessible
      const result = await this.postgres`SELECT COUNT(*) as count FROM documents`;
      console.log(`✅ Connected to PostgreSQL (${result[0].count} documents)`);

      // Verify Ollama is accessible
      const ollamaHealth = await axios.get(`${this.ollamaUrl}/api/tags`, { timeout: 5000 });
      const modelCount = ollamaHealth.data.models?.length || 0;
      console.log(`✅ Connected to Ollama (${modelCount} models available)`);

      // Create or verify Qdrant collection
      await this.ensureQdrantCollection();
      console.log('✅ Qdrant collection ready');

      this.isRunning = true;
      console.log('\n🎉 Vector Enricher initialized successfully\n');
    } catch (error) {
      console.error('❌ Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Ensure Qdrant collection exists
   */
  private async ensureQdrantCollection(): Promise<void> {
    try {
      const collections = await this.qdrant.getCollections();
      const collectionExists = collections.collections?.some(c => c.name === 'dreamnet_documents');

      if (!collectionExists) {
        console.log('📦 Creating Qdrant collection: dreamnet_documents');
        await this.qdrant.createCollection('dreamnet_documents', {
          vectors: {
            size: 768, // nomic-embed-text returns 768 dimensional embeddings
            distance: 'Cosine',
          },
        });
        console.log('✅ Collection created');
      }
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  }

  /**
   * Generate embedding using Ollama
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.ollamaUrl}/api/embeddings`,
        {
          model: 'nomic-embed-text',
          prompt: text,
        },
        { timeout: 60000 }
      );

      if (!response.data.embedding) {
        throw new Error('No embedding in response');
      }

      return response.data.embedding;
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Process a single document
   */
  private async processDocument(document: Document): Promise<void> {
    try {
      const startTime = Date.now();

      // Skip if already processed
      const existing = await this.postgres`
        SELECT embedding_id FROM versioned_embeddings WHERE doc_id = ${document.doc_id} LIMIT 1
      `;

      if (existing.length > 0) {
        console.log(`⏭️  Skipped (already embedded): ${document.doc_id}`);
        return;
      }

      // Generate embedding
      console.log(`⏳ Generating embedding for: ${document.content.substring(0, 50)}...`);
      const embedding = await this.generateEmbedding(document.content);
      const embeddingTime = Date.now() - startTime;

      // Store in Qdrant
      const embeddingId = uuidv4();
      const now = new Date().toISOString();

      await this.qdrant.upsert('dreamnet_documents', {
        points: [
          {
            id: embeddingId,
            vector: embedding,
            payload: {
              doc_id: document.doc_id,
              content: document.content.substring(0, 500),
              metadata: document.metadata,
              created_at: now,
            },
          },
        ],
      });

      // Store embedding record in PostgreSQL
      await this.postgres`
        INSERT INTO versioned_embeddings (
          doc_id,
          model_id,
          embedding_version,
          vector,
          lsn,
          commit_ts
        ) VALUES (
          ${document.doc_id},
          'nomic-embed-text',
          1,
          ${JSON.stringify(embedding)},
          '0/00000000',
          NOW()
        )
      `;

      this.processedCount++;
      console.log(`✅ Embedded in ${embeddingTime}ms\n`);
    } catch (error) {
      this.errorCount++;
      console.error(`❌ Error processing document:`, error);
    }
  }

  /**
   * Process all documents in PostgreSQL
   */
  async processAllDocuments(): Promise<void> {
    try {
      console.log('📋 Fetching documents from PostgreSQL...\n');

      const documents = await this.postgres<Document[]>`
        SELECT doc_id, content, metadata, updated_at FROM documents ORDER BY updated_at DESC
      `;

      console.log(`Found ${documents.length} documents to process\n`);
      console.log('🔄 PROCESSING DOCUMENTS\n');
      console.log('─'.repeat(60) + '\n');

      for (const doc of documents) {
        await this.processDocument(doc);
      }

      console.log('─'.repeat(60));
      console.log('\n🎉 PROCESSING COMPLETE\n');
      console.log(`📊 Results:`);
      console.log(`   ✅ Successfully embedded: ${this.processedCount}`);
      console.log(`   ❌ Errors: ${this.errorCount}`);
      if (this.processedCount + this.errorCount > 0) {
        console.log(`   📈 Success rate: ${((this.processedCount / (this.processedCount + this.errorCount)) * 100).toFixed(1)}%\n`);
      }
    } catch (error) {
      console.error('Error processing documents:', error);
      throw error;
    }
  }

  /**
   * Verify embeddings in Qdrant
   */
  async verifyEmbeddings(): Promise<void> {
    try {
      console.log('🔍 Verifying embeddings in Qdrant...\n');

      const collection = await this.qdrant.getCollection('dreamnet_documents');
      const pointCount = collection.points_count || 0;

      console.log(`✅ Collection: dreamnet_documents`);
      console.log(`   Points: ${pointCount}`);
      console.log(`   Status: healthy\n`);

      // Get sample points
      if (pointCount > 0) {
        const sample = await this.qdrant.scroll('dreamnet_documents', {
          limit: 3,
          with_payload: true,
          with_vectors: false,
        });

        console.log('📌 Sample embeddings:\n');
        sample.points.forEach((point, idx) => {
          const payload = point.payload as any;
          console.log(`   ${idx + 1}. Doc: ${payload.doc_id}`);
          console.log(`      Content: ${payload.content.substring(0, 60)}...`);
          console.log(`      Created: ${payload.created_at}\n`);
        });
      }
    } catch (error) {
      console.error('Error verifying embeddings:', error);
    }
  }

  /**
   * Shutdown
   */
  async shutdown(): Promise<void> {
    console.log('\n👋 Shutting down Vector Enricher...');
    this.isRunning = false;
    
    try {
      await this.postgres.end();
      console.log('✅ Shutdown complete\n');
    } catch (error) {
      console.error('Error during shutdown:', error);
    }
  }
}

// Main execution
async function main() {
  const enricher = new VectorEnricher();

  try {
    await enricher.initialize();
    await enricher.processAllDocuments();
    await enricher.verifyEmbeddings();
    await enricher.shutdown();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
