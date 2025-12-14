# Antigravity Quick Tasks - Latent Collaboration

## 🔴 Critical (Do First)

1. **Database Migration**
   ```sql
   CREATE TABLE latent_sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     created_at TIMESTAMP DEFAULT NOW(),
     source TEXT,
     task TEXT,
     input_prompt TEXT,
     latent_rep JSONB,
     decoded_output TEXT,
     related_agents JSONB,
     onchain_context JSONB,
     metadata JSONB
   );
   
   CREATE INDEX idx_latent_sessions_created_at ON latent_sessions(created_at DESC);
   CREATE INDEX idx_latent_sessions_source ON latent_sessions(source);
   CREATE INDEX idx_latent_sessions_related_agents ON latent_sessions USING GIN(related_agents);
   ```

2. **Verify Dependencies**
   - Check `openai` package is installed
   - Run `pnpm install` in root
   - Verify workspace packages are linked correctly

3. **Environment Variables**
   - Add to `.env` files:
     ```
     USE_LATENT_COLLABORATION=false
     OPENAI_API_KEY=your_key_here  # Optional
     LATENT_EMBEDDING_MODEL=text-embedding-3-small  # Optional
     LATENT_VECTOR_SIZE=1536  # Optional
     ```

## 🟡 Important (Do Next)

4. **Test Integration**
   - Start server
   - Check logs for `[Latent Collaboration]` initialization
   - Verify `/api/latent-sessions` endpoint works
   - Check DreamScope UI shows panel

5. **Verify Feature Flag**
   - Test with `USE_LATENT_COLLABORATION=false` (should skip)
   - Test with `USE_LATENT_COLLABORATION=true` (should run)
   - Verify no errors when disabled

## 🟢 Nice-to-Have

6. **Add Monitoring** (if time permits)
   - Metrics for latent sessions created
   - Encoding latency tracking
   - Error rate monitoring

## Files to Review

- `docs/ANTIGRAVITY_LATENT_COLLABORATION_UPDATE.md` - Full details
- `docs/LATENT_COLLABORATION.md` - User documentation
- `shared/schema.ts` - Database schema changes
- `server/index.ts` - Initialization code (lines ~1424-1443, ~1744-1762)

