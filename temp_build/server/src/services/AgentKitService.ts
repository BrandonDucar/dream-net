import { AgentKit, CdpWalletProvider } from "@coinbase/agentkit";
import { getLangChainTools } from "@coinbase/agentkit-langchain";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as fs from "fs";

// Configure CDP Wallet Provider
const WALLET_DATA_FILE = "wallet_data.txt";

export class AgentKitService {
    private static instance: AgentKitService;
    public agent: any;
    public config: any;

    private constructor() { }

    public static async getInstance(): Promise<AgentKitService> {
        if (!AgentKitService.instance) {
            AgentKitService.instance = new AgentKitService();
            await AgentKitService.instance.initialize();
        }
        return AgentKitService.instance;
    }

    private async initialize() {
        try {
            // Load existing wallet data if available
            let walletDataStr: string | undefined = undefined;
            if (fs.existsSync(WALLET_DATA_FILE)) {
                walletDataStr = fs.readFileSync(WALLET_DATA_FILE, "utf8");
            }

            // Configure CDP Wallet Provider
            const config = {
                apiKeyName: process.env.CDP_API_KEY_NAME,
                apiKeyPrivateKey: process.env.CDP_API_KEY_PRIVATE_KEY?.replace(/\\n/g, "\n"),
                cdpWalletData: walletDataStr,
                networkId: process.env.NETWORK_ID || "base-sepolia",
            };

            const walletProvider = await CdpWalletProvider.configureWithWallet(config);

            // Initialize AgentKit
            const agentKit = await AgentKit.from({
                walletProvider,
                actionProviders: [
                    // Add action providers here (e.g. wethActionProvider(), pythActionProvider())
                ],
            });

            const tools = await getLangChainTools(agentKit);
            const memory = new MemorySaver();
            const agentConfig = { configurable: { thread_id: "CDP Agent Kit Chatbot Example!" } };

            // Create React Agent using LangGraph
            const llm = new ChatOpenAI({
                model: "gpt-4o-mini",
            });

            this.agent = createReactAgent({
                llm,
                tools,
                checkpointSaver: memory,
                messageModifier: `
          You are a helpful agent that can interact onchain using the Coinbase Developer Platform AgentKit.
          You are empowered to interact onchain using your tools.
          If you ever need funds, you can request them from the faucet if you are on network ID 'base-sepolia'.
          If you do not have your wallet details, you can request them using the 'get_wallet_details' tool.
        `,
            });

            this.config = agentConfig;

            // Save wallet data
            const exportedWallet = await walletProvider.exportWallet();
            fs.writeFileSync(WALLET_DATA_FILE, JSON.stringify(exportedWallet));

            console.log("AgentKit initialized successfully!");
        } catch (error) {
            console.error("Failed to initialize AgentKit:", error);
            throw error;
        }
    }

    public async execute(input: string): Promise<string> {
        if (!this.agent) {
            await this.initialize();
        }

        const stream = await this.agent.stream({ messages: [input] }, this.config);
        let finalResponse = "";

        for await (const chunk of stream) {
            if ("agent" in chunk) {
                finalResponse = chunk.agent.messages[0].content;
            } else if ("tools" in chunk) {
                finalResponse = chunk.tools.messages[0].content;
            }
        }

        return finalResponse;
    }
}
