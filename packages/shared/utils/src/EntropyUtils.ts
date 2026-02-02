import crypto from 'crypto';

/**
 * @dreamnet/utils
 * generateHighEntropySlug
 * 
 * Satisfies the Emergent.sh requirement: 
 * "CRITICAL-Slug generation must include a high-entropy random suffix (≥32 bits of entropy)"
 * 
 * This implementation uses 64 bits (8 bytes) of entropy to exceed the mandate.
 */

export function generateHighEntropySlug(base: string): string {
    // 8 bytes = 64 bits of entropy.
    const entropy = crypto.randomBytes(8).toString('hex');

    // Normalize base: lowercase, replace spaces with hyphens, remove non-alphanumeric.
    const normalizedBase = base
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    return `${normalizedBase}-${entropy}`;
}

// Example usage:
// console.log(generateHighEntropySlug('MoltBot Installation'));
// Output: moltbot-installation-a1b2c3d4e5f6g7h8
