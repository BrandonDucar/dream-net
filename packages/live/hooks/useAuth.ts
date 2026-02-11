import { PheromoneScore } from '@dreamnet/shared/types';

export interface AuthState {
    user: any | null;
    walletAddress: string | null;
    isAuthenticated: boolean;
    loading: boolean;
}

export const useAuth = () => {
    // Stub for wallet connection logic
    return {
        user: null,
        walletAddress: '0x123...abc',
        isAuthenticated: true,
        connect: async () => console.log('Connecting...'),
        disconnect: async () => console.log('Disconnecting...'),
    };
};
