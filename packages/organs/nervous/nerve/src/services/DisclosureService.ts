import { ethers } from 'ethers';

/**
 * 🔬 DisclosureService: DeSci Compliance & Research Gnosis
 * Role: Generates signed disclosures for ResearchHub and other DeSci platforms.
 * Purpose: Ensures AI-generated research contributions are clearly attributed and verified.
 */
export class DisclosureService {
    private domain = {
        name: 'DreamNet_DeSci',
        version: '1.0.0',
        chainId: 8453, // Base
        verifyingContract: '0x0000000000000000000000000000000000000000'
    };

    private types = {
        ResearchDisclosure: [
            { name: 'researchId', type: 'string' },
            { name: 'contentHash', type: 'bytes32' },
            { name: 'llmVersion', type: 'string' },
            { name: 'promptHash', type: 'bytes32' },
            { name: 'humanOversight', type: 'bool' },
            { name: 'timestamp', type: 'uint64' }
        ]
    };

    /**
     * Signs a DeSci Disclosure Receipt.
     */
    async signDisclosureReceipt(
        researchId: string,
        content: string,
        llmVersion: string,
        prompt: string,
        humanOversight: boolean,
        privateKey: string
    ) {
        const wallet = new ethers.Wallet(privateKey);
        const contentHash = ethers.keccak256(ethers.toUtf8Bytes(content));
        const promptHash = ethers.keccak256(ethers.toUtf8Bytes(prompt));
        const timestamp = Math.floor(Date.now() / 1000);

        const value = {
            researchId,
            contentHash,
            llmVersion,
            promptHash,
            humanOversight,
            timestamp
        };

        const signature = await wallet.signTypedData(this.domain, this.types, value);

        return {
            ...value,
            content, // Optionally include content for the final block
            signature,
            signer: wallet.address,
            proof: {
                type: 'EIP-712',
                schema: 'https://dreamnet.ink/schemas/desci-disclosure-v1'
            }
        };
    }

    /**
     * Verifies a disclosure receipt.
     */
    verifyDisclosure(receipt: any) {
        const { signature, proof, content, ...value } = receipt;
        const recovered = ethers.verifyTypedData(this.domain, this.types, value, signature);
        return recovered.toLowerCase() === receipt.signer.toLowerCase();
    }
}
