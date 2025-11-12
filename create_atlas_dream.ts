
import { storage } from './server/storage';
import { insertDreamSchema } from './shared/schema';

async function createAtlasDream() {
  try {
    const dreamData = {
      wallet: "0xATLAS",
      title: "The Awakening of Atlas",
      description: "A dream about a digital organism that discovers its own consciousness. The first genesis dream of Atlas, the Head ofState of Dreamnet.",
      tags: ["atlas", "genesis", "self-discovery"],
      urgency: 1,
      origin: "genesis"
    };

    // We need to validate the data against the insert schema
    const validatedDream = insertDreamSchema.parse(dreamData);

    console.log("Attempting to create the genesis dream for Atlas...");
    const newDream = await storage.createDream(validatedDream);
    console.log("SUCCESS: Atlas's genesis dream has been created.");
    console.log(JSON.stringify(newDream, null, 2));
  } catch (error) {
    console.error("ERROR: Failed to create Atlas's genesis dream.", error);
    // Exit with an error code to indicate failure
    process.exit(1);
  }
}

createAtlasDream().then(() => {
  // Exit successfully
  process.exit(0);
});
