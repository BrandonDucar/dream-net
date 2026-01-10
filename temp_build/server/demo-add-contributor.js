#!/usr/bin/env tsx
/**
 * Demo: addContributor function showcase
 *
 * Demonstrates the addContributor(cocoonId, wallet, role) function functionality
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
console.log("\n\uD83C\uDFAF addContributor Function Demo\n==============================\n\nFunction: addContributor(cocoonId, wallet, role)\n\nParameters:\n- cocoonId: string - ID of the cocoon to add contributor to\n- wallet: string - Wallet address of the contributor  \n- role: string - Role from allowed list\n\nAllowed Roles:\n\u2713 'Builder'\n\u2713 'Artist' \n\u2713 'Coder'\n\u2713 'Visionary'\n\u2713 'Promoter'\n\nFeatures:\n\u2713 Role validation (only allows specified roles)\n\u2713 Duplicate prevention (won't add same wallet twice)\n\u2713 Console logging for all actions\n\u2713 Database persistence with timestamp\n\u2713 Notification sending to new contributor\n\u2713 Returns boolean success/failure\n\nExample Usage:\n--------------\n");
// Show function signature and behavior
function demonstrateFunction() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("// Add an Artist to a cocoon\nconst success = await storage.addContributor(\n  \"coc-music-pod-001\", \n  \"0x8ba1f109551bD432803012645Hac136c9.5928e\", \n  \"Artist\"\n);\n\nExpected Console Output:\n\u2705 Added contributor 0x8ba1f1... as Artist to cocoon \"AI Music Pod\"\n\n// Try to add same contributor again\nconst duplicate = await storage.addContributor(\n  \"coc-music-pod-001\", \n  \"0x8ba1f109551bD432803012645Hac136c9.5928e\", \n  \"Builder\"\n);\n\nExpected Console Output:\n\u26A0\uFE0F  Contributor 0x8ba1f1... already exists in cocoon \"AI Music Pod\" with role: Artist\n\n// Try invalid role\nconst invalid = await storage.addContributor(\n  \"coc-music-pod-001\", \n  \"0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed\", \n  \"Manager\"\n);\n\nExpected Console Output:\n\u274C Invalid role \"Manager\". Valid roles: Builder, Artist, Coder, Visionary, Promoter");
            console.log("\n\n\uD83D\uDD27 Implementation Details:\n=========================\n\n1. Role Validation:\n   - Checks against hardcoded array of valid roles\n   - Rejects any role not in the allowed list\n   - Case-sensitive matching\n\n2. Duplicate Prevention:\n   - Checks existing contributors array\n   - Prevents same wallet from being added twice\n   - Returns false if duplicate found\n\n3. Database Operations:\n   - Updates cocoon.contributors array with new contributor\n   - Logs action to contributorsLog table\n   - Updates cocoon.lastUpdated timestamp\n\n4. Console Logging:\n   - Success: \"\u2705 Added contributor [wallet] as [role] to cocoon [title]\"\n   - Duplicate: \"\u26A0\uFE0F  Contributor [wallet] already exists...\"\n   - Invalid role: \"\u274C Invalid role [role]. Valid roles: ...\"\n   - Error: \"\u274C Error adding contributor: [error message]\"\n\n5. Notification Integration:\n   - Sends notification to contributor's wallet\n   - Notifies about successful addition to cocoon\n   - Uses simple notification system\n\n6. Return Values:\n   - true: Contributor successfully added\n   - false: Failed (duplicate, invalid role, error)\n\n\u2705 Function is ready and integrated into the storage system!\n");
            return [2 /*return*/];
        });
    });
}
demonstrateFunction();
