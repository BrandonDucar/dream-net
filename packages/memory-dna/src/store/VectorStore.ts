
export const vectorStore = {
    addMemory: async (text: string, metadata: any = {}) => {
        console.log(`🧠 [VectorStore] Storing memory: "${text.substring(0, 50)}..."`);
        // Simple mock implementation for now to allow boot
        return `mem_${Date.now()}`;
    },
    query: async (query: string, limit: number = 5) => {
        console.log(`🔍 [VectorStore] Querying for: "${query}"`);
        return [];
    },
    search: async (query: string, limit: number = 5) => {
        console.log(`🔍 [VectorStore] Searching for: "${query}"`);
        return [];
    }
};
