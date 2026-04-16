import { blackboardLogger } from './spine/utils/BlackboardLogger.js';

async function testLogger() {
    console.log('🧪 Testing BlackboardLogger...');
    await blackboardLogger.logOutreach('Manual Test Target', 'TEST_CAMPAIGN', 'SUCCESS');
    console.log('🧪 Done.');
}

testLogger().catch(console.error);
