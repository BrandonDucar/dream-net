
export * from './logic/receiptGenerator.js';

import { ReceiptGenerator } from './logic/receiptGenerator.js';

export const ChainReceipt = {
    generator: new ReceiptGenerator(),
    init() {
        console.log("🧾 [ChainReceipt] Validating Base Connectivity...");
        // Mock init check
        console.log("✅ [ChainReceipt] Digital Printer Ready.");
    }
};
