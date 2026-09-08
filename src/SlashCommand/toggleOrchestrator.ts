//toggleOrchestrator
import type { commandType, handler } from "../Types/slashCommand";
import { read } from "../util/read";
import { write } from "../util/write";

async function toggleOrchestrator(params: string[]): Promise<handler> {
    const settingString = await read();
    if (!settingString.success) return { status: 500, success: false, message: "Error reading the settings file.", error: settingString.error };
    const settings = JSON.parse(settingString.data as string);
    settings.orchestrator = settings.orchestrator === undefined ? false : !settings.orchestrator;
    await write(JSON.stringify(settings, null, 2));
    return { status: 200, success: true, message: `toggle orchestration mode`, data: { orchestrator: settings.orchestrator } };
}

const ToggleOrchestratorCommand = {
    command: "/toggle-orchestrator",
    description: "Toggle between the orchestration mode",
    handler: toggleOrchestrator,
};

export default ToggleOrchestratorCommand;
