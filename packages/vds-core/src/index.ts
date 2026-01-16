
import { ethers } from 'ethers';

/**
 * EliteID: The Sovereign Identity
 * Bound to a physical NTAG 424 DNA chip.
 */
export interface EliteID {
    uuid: string;         // Internal Upgradeable UUID
    hardwareId: string;   // NTAG UID (Immutable)
    clearanceLevel: number;
    genes: string[];      // Merkle Root of Genetic Traits
}

/**
 * Verifiable Data Structure (VDS)
 * A cryptographically signed envelope containing data.
 */
export interface VDS {
    payload: any;
    signature: string; // ECDSA Signature
    signer: string;    // Public Key of the Signer (The System)
    hash: string;      // Keccak256 Hash of Payload
}

/**
 * Titan Key Core
 * Handles the signing and verification of VDS packets.
 */
export class TitanKey {
    private wallet: ethers.Wallet;

    constructor(privateKey: string) {
        this.wallet = new ethers.Wallet(privateKey);
    }

    /**
     * Forge a VDS (Sign Data)
     * This turns raw NTAG data into a verifiable "EliteID" credential.
     */
    async forge(data: EliteID): Promise<VDS> {
        const payloadString = JSON.stringify(data);
        const hash = ethers.keccak256(ethers.toUtf8Bytes(payloadString));
        const signature = await this.wallet.signMessage(ethers.getBytes(hash));

        return {
            payload: data,
            signature,
            signer: this.wallet.address,
            hash
        };
    }

    /**
     * Verify a VDS
     */
    verify(vds: VDS): boolean {
        const payloadString = JSON.stringify(vds.payload);
        const hash = ethers.keccak256(ethers.toUtf8Bytes(payloadString));

        // 1. Verify Hash Integrity
        if (hash !== vds.hash) return false;

        // 2. Verify Signature
        const recoveredAddress = ethers.verifyMessage(ethers.getBytes(hash), vds.signature);
        return recoveredAddress === vds.signer;
    }
}
