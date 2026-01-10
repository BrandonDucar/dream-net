
// Nano Jobs - AI Generation History
export const nanoJobs = pgTable("nano_jobs", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull(),
    mode: text("mode").notNull(), // text2img, img2img, edit
    prompt: text("prompt").notNull(),
    latencyMs: integer("latency_ms"),
    creditsUsed: integer("credits_used").default(1),
    provider: text("provider"),
    provenanceJson: jsonb("provenance_json"),
    imageUrl: text("image_url"),
    parameters: jsonb("parameters"),
    status: text("status").notNull(), // completed, failed
    errorMessage: text("error_message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Nano Rate Limits override table (optional, but referenced in nano.ts)
export const nanoRateLimits = pgTable("nano_rate_limits", {
    id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: varchar("user_id").notNull().unique(),
    limitHourly: integer("limit_hourly").notNull().default(10),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
