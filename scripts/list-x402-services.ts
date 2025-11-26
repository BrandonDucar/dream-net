/**
 * List DreamNet Services in X402 Marketplace
 */

import { x402PaymentGateway } from "../server/core/agents/X402PaymentGateway.js";

const DREAMNET_SERVICES = [
  {
    agentId: "dreamnet-api-access",
    serviceName: "DreamNet API Access",
    description: "Full access to DreamNet API with 1000 requests/month",
    price: "1000",
    chain: "base" as const,
  },
  {
    agentId: "wolf-pack-funding",
    serviceName: "Wolf Pack Funding Discovery",
    description: "AI-powered funding opportunity discovery",
    price: "500",
    chain: "base" as const,
  },
  {
    agentId: "social-media-posting",
    serviceName: "Multi-Platform Social Media Posting",
    description: "Post to 13+ platforms simultaneously",
    price: "250",
    chain: "base" as const,
  },
];

async function listAllServices() {
  console.log("🚀 Listing DreamNet Services in X402 Marketplace...\n");

  for (const service of DREAMNET_SERVICES) {
    try {
      const listedService = await x402PaymentGateway.listService({
        serviceId: service.agentId,
        agentId: service.agentId,
        serviceName: service.serviceName,
        description: service.description,
        price: service.price,
        chain: service.chain,
        active: true,
      });
      console.log(`✅ Listed: ${service.serviceName} (${service.price} X402)`);
    } catch (error: any) {
      console.error(`❌ Failed: ${service.serviceName}:`, error.message);
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  listAllServices().catch(console.error);
}

export { listAllServices, DREAMNET_SERVICES };
