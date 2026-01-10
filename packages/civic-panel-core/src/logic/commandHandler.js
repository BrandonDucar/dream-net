import { CommandStore } from '../store/commandStore.js';
let cmdCounter = 0;
function nextCommandId() {
    cmdCounter += 1;
    return `cmd-${Date.now()}-${cmdCounter}`;
}
export function enqueueCommand(type, label, meta) {
    return CommandStore.enqueue({
        id: nextCommandId(),
        type,
        label,
        meta,
    });
}
export async function processCommands(ctx) {
    const commands = CommandStore.listRecentCommands(50).filter((c) => c.state === "queued");
    for (const cmd of commands) {
        CommandStore.updateCommandState(cmd.id, "running");
        try {
            await executeCommand(cmd, ctx);
            CommandStore.updateCommandState(cmd.id, "completed");
        }
        catch (err) {
            CommandStore.updateCommandState(cmd.id, "failed", {
                error: String(err),
            });
        }
    }
}
async function executeCommand(cmd, ctx) {
    switch (cmd.type) {
        case "refresh-vault":
            if (ctx.dreamVault?.run)
                ctx.dreamVault.run(ctx);
            break;
        case "refresh-fields":
            if (ctx.fieldLayer?.run)
                ctx.fieldLayer.run(ctx);
            break;
        case "refresh-reputation":
            if (ctx.reputationLattice?.run)
                ctx.reputationLattice.run(ctx);
            break;
        case "refresh-dreamcortex":
            if (ctx.dreamCortex?.run)
                ctx.dreamCortex.run(ctx);
            break;
        case "refresh-dreamshop":
            if (ctx.dreamShop?.run)
                ctx.dreamShop.run(ctx);
            break;
        case "refresh-dreambet":
            if (ctx.dreamBetCore?.run)
                ctx.dreamBetCore.run(ctx);
            break;
        case "refresh-zen":
            if (ctx.zenGardenCore?.run)
                ctx.zenGardenCore.run(ctx);
            break;
        case "noop":
        default:
            // do nothing
            break;
    }
}
//# sourceMappingURL=commandHandler.js.map