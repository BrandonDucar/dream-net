import { ethers } from 'ethers';

/**
 * 🧾 ReceiptService: Sovereign Non-Repudiation
 * Role: Generates and verifies EIP-712 receipts for Agent actions.
 */
export class ReceiptService {
    private domain = {
        name: 'DreamNet_Sovereign',
        version: '1.0.0',
        chainId: 8453, // Base
        verifyingContract: '0x0000000000000000000000000000000000000000'
    };

    private types = {
        AgentAction: [
            { name: 'agentId', type: 'string' },
            { name: 'action', type: 'string' },
            { name: 'payloadHash', type: 'bytes32' },
            { name: 'timestamp', type: 'uint64' }
        ]
    };

    /**
     * Signs a receipt for an agent action.
     */
    async signReceipt(agentId: string, action: string, payload: any, privateKey: string) {
        const wallet = new ethers.Wallet(privateKey);
        const payloadHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(payload)));
        const timestamp = Math.floor(Date.now() / 1000);

        const value = {
            agentId,
            action,
            payloadHash,
            timestamp
        };

        const signature = await wallet.signTypedData(this.domain, this.types, value);

        return {
            ...value,
            signature,
            signer: wallet.address
        };
    }

    /**
     * Verifies a receipt signature.
     */
    verifyReceipt(receipt: any) {
        const { signature, ...value } = receipt;
        const recovered = ethers.verifyTypedData(this.domain, this.types, value, signature);
        return recovered.toLowerCase() === receipt.signer.toLowerCase();
    }
}
