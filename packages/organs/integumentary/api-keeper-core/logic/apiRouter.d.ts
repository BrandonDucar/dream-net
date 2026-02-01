import { APIRequest, APIRoutingDecision } from '../types.js';
/**
 * Route an API request to the best provider/key based on cost, quality, availability
 */
export declare function routeRequest(request: APIRequest): APIRoutingDecision | null;
