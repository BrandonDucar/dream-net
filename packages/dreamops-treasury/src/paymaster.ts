import axios from 'axios';
import { UserOperation } from './types.js';

export class PaymasterClient {
  private paymasterUrl: string;

  constructor(paymasterUrl: string) {
    this.paymasterUrl = paymasterUrl;
  }

  /**
   * Requests paymaster sponsorship (paymasterAndData) for a UserOperation.
   */
  public async getSponsorship(userOp: Partial<UserOperation>): Promise<string> {
    try {
      console.log('📡 [PaymasterClient] Requesting sponsorship from:', this.paymasterUrl);
      
      const response = await axios.post(this.paymasterUrl, {
        method: 'pm_sponsorUserOperation',
        params: [userOp, { sponsorshipPolicyId: 'sp_dreamnet_sponsored_ops' }],
        id: 1,
        jsonrpc: '2.0'
      });

      if (response.data.error) {
        throw new Error(`Paymaster error: ${response.data.error.message}`);
      }

      const paymasterAndData = response.data.result.paymasterAndData;
      console.log('✅ [PaymasterClient] Sponsorship secured.');
      
      return paymasterAndData;
    } catch (error) {
      console.error('❌ [PaymasterClient] Sponsorship request failed:', error);
      throw error;
    }
  }
}
