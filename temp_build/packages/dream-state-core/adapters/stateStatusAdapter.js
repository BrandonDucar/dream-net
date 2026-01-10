"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDreamStateDashboardView = getDreamStateDashboardView;
const index_1 = require("../index");
/**
 * Get Dream State dashboard view model
 */
function getDreamStateDashboardView() {
    const status = index_1.DreamStateCore.status();
    return {
        citizenCount: status.citizenCount,
        passportCount: status.passportCount,
        departmentCount: status.departmentCount,
        diplomaticRelationsCount: status.diplomaticRelationsCount,
        headOfState: status.headOfState,
        citizens: status.sampleCitizens.map((c) => ({
            identityId: c.identityId,
            passportNumber: c.passportNumber,
            tier: c.citizenshipTier,
            joinedAt: c.joinedAt,
            contributions: c.contributions,
        })),
        passports: status.samplePassports.map((p) => ({
            passportNumber: p.passportNumber,
            citizenId: p.citizenId,
            tier: p.citizenshipTier,
            transferable: p.transferable,
            currentOwner: p.currentOwner,
        })),
        departments: status.sampleDepartments.map((d) => ({
            id: d.id,
            name: d.name,
            packId: d.packId,
            responsibilities: d.responsibilities,
        })),
        diplomaticRelations: status.sampleDiplomaticRelations.map((r) => ({
            id: r.id,
            protocolName: r.protocolName,
            protocolType: r.protocolType,
            status: r.status,
        })),
        stateSymbols: status.stateSymbols.map((s) => ({
            type: s.type,
            name: s.name,
            content: s.content,
            description: s.description,
        })),
        recentActions: status.recentActions.map((a) => ({
            type: a.type,
            department: a.department,
            action: a.action,
            timestamp: a.timestamp,
        })),
    };
}
