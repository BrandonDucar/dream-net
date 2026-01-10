/**
 * DreamNet Operational Bridge Stub
 */

export const OperationalBridge = {
    sync: () => Promise.resolve({ ok: true }),
};

export const bridgeToSpiderWeb = (data: any) => {
    console.log("[OperationalBridge] Stub bridgeToSpiderWeb:", data);
};

export default OperationalBridge;
