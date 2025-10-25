import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './server/db/migrations',
  schema: './shared/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
