import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
    authUserIdToIdentityId,
    identityControlsAgent,
    getIdentityAgents,
    linkIdentityToAgent,
    createDreamNetContext,
    getIdentityFromContext,
    isValidDreamNetContext,
    _setIdentityGrid
} from './identity.js';

describe('Identity Layer', () => {
    describe('authUserIdToIdentityId', () => {
        test('should convert clerk ID to identity ID', () => {
            assert.strictEqual(authUserIdToIdentityId('user_2tV1...'), 'user:2tV1___');
            assert.strictEqual(authUserIdToIdentityId('clerk_123'), 'user:123');
        });

        test('should sanitize special characters', () => {
            assert.strictEqual(authUserIdToIdentityId('auth_user!@#'), 'user:user___');
            assert.strictEqual(authUserIdToIdentityId('random_prefix_user!@#'), 'user:random_prefix_user___');
        });
    });

    describe('identityControlsAgent', () => {
        test('should return false when IdentityGrid is not loaded', () => {
            _setIdentityGrid(null);
            const result = identityControlsAgent('user:test', 'agent:test');
            assert.strictEqual(result, false);
        });

        test('should return true if identity has controls linkType', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:1', toId: 'agent:1', linkType: 'controls' }
                ]
            });
            assert.strictEqual(identityControlsAgent('user:1', 'agent:1'), true);
        });

        test('should return true if identity has owns linkType', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:1', toId: 'agent:1', linkType: 'owns' }
                ]
            });
            assert.strictEqual(identityControlsAgent('user:1', 'agent:1'), true);
        });

        test('should return false if linkType is different', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:1', toId: 'agent:1', linkType: 'viewer' }
                ]
            });
            assert.strictEqual(identityControlsAgent('user:1', 'agent:1'), false);
        });

        test('should return false if identityId does not match', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:2', toId: 'agent:1', linkType: 'controls' }
                ]
            });
            assert.strictEqual(identityControlsAgent('user:1', 'agent:1'), false);
        });

        test('should return false if agentId does not match', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:1', toId: 'agent:2', linkType: 'controls' }
                ]
            });
            assert.strictEqual(identityControlsAgent('user:1', 'agent:1'), false);
        });
    });

    describe('getIdentityAgents', () => {
        test('should return empty array when IdentityGrid is not loaded', () => {
            _setIdentityGrid(null);
            const result = getIdentityAgents('user:test');
            assert.deepStrictEqual(result, []);
        });

        test('should return list of agents for given identity', () => {
            _setIdentityGrid({
                listEdges: () => [
                    { fromId: 'user:1', toId: 'agent:1', linkType: 'controls' },
                    { fromId: 'user:1', toId: 'agent:2', linkType: 'owns' },
                    { fromId: 'user:1', toId: 'not-agent:3', linkType: 'controls' },
                    { fromId: 'user:2', toId: 'agent:4', linkType: 'controls' }
                ]
            });
            const agents = getIdentityAgents('user:1');
            assert.deepStrictEqual(agents, ['agent:1', 'agent:2']);
        });
    });

    describe('linkIdentityToAgent', () => {
        test('should return a basic edge object even if IdentityGrid is not loaded', () => {
            _setIdentityGrid(null);
            const result = linkIdentityToAgent('user:test', 'agent:test', 'owns');
            assert.strictEqual(result.fromId, 'user:test');
            assert.strictEqual(result.toId, 'agent:test');
            assert.strictEqual(result.linkType, 'owns');
        });
    });

    describe('Context Functions', () => {
        const authUserId = 'user_abc123';
        const identityId = 'user:abc123';

        test('createDreamNetContext should create a valid context', () => {
            _setIdentityGrid(null);
            const ctx = createDreamNetContext(authUserId, 'Test User', 'test@example.com');
            assert.strictEqual(ctx.authUserId, authUserId);
            assert.strictEqual(ctx.identityId, identityId);
            assert.strictEqual(ctx.displayName, 'Test User');
            assert.strictEqual(ctx.email, 'test@example.com');
        });

        test('getIdentityFromContext should extract identityId', () => {
            const ctx = createDreamNetContext(authUserId);
            assert.strictEqual(getIdentityFromContext(ctx), identityId);
            assert.strictEqual(getIdentityFromContext(undefined), undefined);
        });

        test('isValidDreamNetContext should validate correctly', () => {
            const validCtx = createDreamNetContext(authUserId);
            assert.strictEqual(isValidDreamNetContext(validCtx), true);
            assert.strictEqual(!!isValidDreamNetContext({}), false);
            assert.strictEqual(!!isValidDreamNetContext(null), false);
            assert.strictEqual(!!isValidDreamNetContext({ authUserId: '123', identityId: 'not-user:123' }), false);
        });
    });
});
