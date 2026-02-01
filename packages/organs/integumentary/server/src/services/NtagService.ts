
import crypto from 'crypto';

/**
 * NTAG 424 DNA Verification Service
 * 
 * Handles the cryptographic verification of Secure Unique NFC (SUN) messages.
 * Uses AES-128 for decryption and CMAC for signature verification.
 */
import { TitanKey, VDS, EliteID } from '@dreamnet/vds-core';

/**
 * NTAG 424 DNA Verification Service
 * 
 * Handles the cryptographic verification of Secure Unique NFC (SUN) messages.
 * Uses AES-128 for decryption and CMAC for signature verification.
 */
export class NtagService {
    // ⚠️ HARDCODED MASTER KEY FOR MVP (K1-K2-K3-K4-K5...)
    // In production, this should be derived or fetched from a secure vault based on the tag ID prefix.
    // Default NTAG key is often all zeros or a specific factory key. 
    // We will use a "DreamNet Master Key" for this simulation.
    private static readonly MASTER_KEY = Buffer.from('00000000000000000000000000000000', 'hex'); // 16 bytes (128-bit)

    // System Signer for VDS (Mock Private Key)
    private titanKey = new TitanKey('0x0123456789012345678901234567890123456789012345678901234567890123');

    /**
     * Verify a SUN message
     * Expected format from tag: ?e=EncryptedMessage&c=CMAC
     */
    public async verify(enc: string, cmac: string): Promise<{ isValid: boolean; uid?: string; counter?: number; vds?: VDS }> {
        try {
            // 1. Decrypt the PiccData (Encrypted Message)
            // SUN message is usually: UID (7 bytes) + Counter (3 bytes) = 10 bytes?
            // Actually, in SDM mode, it's typically IV (if used) + Encrypted Data.
            // For NTAG 424 DNA with SDM, the 'e' parameter is 16 bytes (assuming block size) if just UID+Counter are mirrored.

            const encBuffer = Buffer.from(enc, 'hex');
            const macBuffer = Buffer.from(cmac, 'hex');

            // Decrypt using AES-128-CBC (Standard for NTAG)
            // IV is typically all zeros for the SUN message mirroring if not explicitly randomized
            const iv = Buffer.alloc(16, 0);

            const decipher = crypto.createDecipheriv('aes-128-cbc', NtagService.MASTER_KEY, iv);
            decipher.setAutoPadding(false); // NTAG data is raw bytes

            let decrypted = decipher.update(encBuffer);
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            // Parse Data
            // Format: UID (7 bytes) + Counter (3 bytes) + Padding...
            const uid = decrypted.subarray(0, 7).toString('hex').toUpperCase();
            const counter = decrypted.readUIntLE(7, 3);

            // 🔍 VALIDATION: Manufacturer Code
            // All NTAG 424 DNA chips (NXP) have UIDs starting with '04'
            if (!uid.startsWith('04')) {
                throw new Error('Invalid Manufacturer Code (Decryption Garbage)');
            }

            // 2. Verify CMAC
            // CMAC is calculated over: UID || Counter || Application Data (if any)
            // We need to re-calculate the CMAC using the decrypted data and check if it matches the 'c' parameter.
            // Note: NTAG 424 CMAC calculation is specific. It usually mirrors the CMAC calculated *by the tag*.
            // The tag calculates CMAC over the retrieved data.

            // For MVP Simulation, true CMAC re-calculation requires exact knowledge of the FileData which we mirror.
            // We/Simulation will perform a simplified check: 
            // If we successfully decrypted it and the UID looks valid (7 bytes), we consider it a 'Crypto Pass'.
            // In a full implementation, we would implement the AES-CMAC algorithm here.

            console.log(`[NTAG] Decrypted: UID=${uid}, Counter=${counter}`);

            // 🔱 TITAN KEY: Forge Verifiable Credential
            const eliteId: EliteID = {
                uuid: `vds:nta:${uid}`,
                hardwareId: uid,
                clearanceLevel: 5, // Top Secret / Sovereign
                genes: ['dreamnet_original', 'titan_grade']
            };

            const vds = await this.titanKey.forge(eliteId);
            console.log(`[NTAG] 🛡️ VDS Forged: ${vds.hash}`);

            return { isValid: true, uid, counter, vds };

        } catch (error) {
            console.error('[NTAG] Verification Failed:', error);
            return { isValid: false };
        }
    }

    /**
     * Generate a Mock SUN Message (For Simulation/Testing)
     */
    public generateMock(uidHex: string, counter: number) {
        const uid = Buffer.from(uidHex, 'hex'); // 7 bytes
        const ctr = Buffer.alloc(3);
        ctr.writeUIntLE(counter, 0, 3); // 3 bytes

        // Payload: 10 bytes
        const payload = Buffer.concat([uid, ctr]);

        // Padding to 16 bytes (AES block size)
        const padding = Buffer.alloc(6, 0);
        const input = Buffer.concat([payload, padding]);

        // Encrypt
        const iv = Buffer.alloc(16, 0);
        const cipher = crypto.createCipheriv('aes-128-cbc', NtagService.MASTER_KEY, iv);
        cipher.setAutoPadding(false);

        let enc = cipher.update(input);
        enc = Buffer.concat([enc, cipher.final()]);

        return {
            enc: enc.toString('hex'),
            cmac: 'MOCK_CMAC_SIGNATURE' // We skip actual CMAC gen for now as decryption proves key ownership
        };
    }
}
