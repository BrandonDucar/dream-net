import { storage } from './storage.js';
import type { Dream } from "@dreamnet/shared/schema";

export async function seedDreams(): Promise<void> {
  console.log("🌱 Starting dream seeding process...");
  
  const dreams: Dream[] = [];
  const baseTags = ['ai', 'crypto', 'music', 'edu'];
  const coreTypes = ['Vision', 'Tool', 'Movement'];
  
  for (let i = 0; i < 3; i++) {
    const dream: Dream = {
      id: `dream-${i}`,
      name: `Dream ${i}`,
      creator: `0xFAKE${i}`,
      wallet: `0xFAKE${i}`,
      tags: [baseTags[i % baseTags.length]],
      score: 0,
      evolved: false,
      lastUpdated: new Date().toISOString(),
      coreType: coreTypes[i % coreTypes.length] as 'Vision' | 'Tool' | 'Movement',
      description: `This is the seed description for Dream ${i}.`,
      image: `https://picsum.photos/seed/${i}/300/200`,
      status: 'Draft',
    };
    dreams.push(dream);
    console.log(`Seeded dream: ${dream.name}`);
  }
  
  console.log(`📦 Created ${dreams.length} dreams with pattern: ${dreams.map(d => `${d.id}(${d.coreType})`).join(', ')}`);
  
  // Attempt to seed dreams to database
  try {
    for (const dream of dreams) {
      try {
        await storage.createDream({
          wallet: dream.creator,
          title: dream.name,
          description: dream.description || '',
          tags: dream.tags,
          urgency: dream.score
        });
        console.log(`✅ Seeded dream: ${dream.id} - ${dream.name}`);
      } catch (dreamError: any) {
        console.log(`⚠️  Failed to seed ${dream.id}: ${dreamError.message}`);
      }
    }
    console.log("🎉 Dream seeding completed successfully!");
  } catch (error: any) {
    console.log(`❌ Database seeding failed: ${error.message}`);
    console.log("💡 Dreams are available in static sample data as fallback");
  }
}

// Auto-run seeding when this module is imported
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDreams().catch(console.error);
}