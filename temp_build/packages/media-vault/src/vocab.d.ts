/**
 * Entity vocabulary normalization
 * Maps various entity mentions to controlled vocabulary
 */
export declare function normalizeEntity(text: string): string[];
export declare function extractTagsFromFilename(filename: string): string[];
export declare function extractTagsFromPrompt(prompt: string): string[];
export declare const HASHTAG_PRESETS: Record<string, string[]>;
export declare function getHashtagsForTags(tags: string[]): string[];
