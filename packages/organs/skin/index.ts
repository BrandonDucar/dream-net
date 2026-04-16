/**
 * @dreamnet/skin — External API Surface & Rate Limiting
 * 
 * The outermost layer. Manages public API endpoints, rate limiting, and CORS.
 * Re-exports integumentary for backward compatibility.
 */

export { connect, createPost, getPosts, publishToAll, bridge } from '../integumentary/index.js';
export default {};
