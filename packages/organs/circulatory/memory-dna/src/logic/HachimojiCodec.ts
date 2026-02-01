/**
 * 🧬 Hachimoji Codec (Avenue 10)
 * 
 * Maps 64-bit floating point vectors and binary data to an 8-letter synthetic DNA alphabet:
 * A, T, C, G (Natural) + P, Z, S, B (Synthetic)
 */

const HACHIMOJI_ALPHABET = ['A', 'T', 'C', 'G', 'P', 'Z', 'S', 'B'];

export class HachimojiCodec {
    /**
     * Encodes a Buffer or Uint8Array into a Hachimoji string.
     * Each byte (8 bits) is represented by 3 Hachimoji base-pairs (8^3 = 512, enough for 256).
     */
    public static encode(data: Uint8Array): string {
        let result = '';
        for (let i = 0; i < data.length; i++) {
            let val = data[i];
            const p1 = val % 8;
            val = Math.floor(val / 8);
            const p2 = val % 8;
            val = Math.floor(val / 8);
            const p3 = val % 8;

            result += HACHIMOJI_ALPHABET[p3] + HACHIMOJI_ALPHABET[p2] + HACHIMOJI_ALPHABET[p1];
        }
        return result;
    }

    /**
     * Decodes a Hachimoji string back into a Uint8Array.
     */
    public static decode(hachimo: string): Uint8Array {
        if (hachimo.length % 3 !== 0) throw new Error("Invalid Hachimoji sequence length.");

        const result = new Uint8Array(hachimo.length / 3);
        const map: Record<string, number> = {};
        HACHIMOJI_ALPHABET.forEach((letter, index) => map[letter] = index);

        for (let i = 0; i < hachimo.length; i += 3) {
            const p3 = map[hachimo[i]];
            const p2 = map[hachimo[i + 1]];
            const p1 = map[hachimo[i + 2]];

            if (p1 === undefined || p2 === undefined || p3 === undefined) {
                throw new Error(`Non-Hachimoji character found at position ${i}`);
            }

            result[i / 3] = p3 * 64 + p2 * 8 + p1;
        }
        return result;
    }

    /**
     * Vector Compression: Encodes a number array (vector) into Hachimoji.
     */
    public static encodeVector(vector: number[]): string {
        // Convert numbers to 16-bit integers (clamped 0-1 range to 0-65535)
        const buffer = new Uint8Array(vector.length * 2);
        const view = new DataView(buffer.buffer);

        vector.forEach((num, i) => {
            const val = Math.floor(Math.max(0, Math.min(1, num)) * 65535);
            view.setUint16(i * 2, val);
        });

        return this.encode(buffer);
    }
}
