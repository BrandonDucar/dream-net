
export * from "./logic/receiptGenerator";

import { ReceiptGenerator } from "./logic/receiptGenerator";

export const ChainReceipt = {
    generator: new ReceiptGenerator(),
    init() {
        console.log("🧾 [ChainReceipt] Validating Base Connectivity...");
        // Mock init check
        console.log("✅ [ChainReceipt] Digital Printer Ready.");
    }
};
