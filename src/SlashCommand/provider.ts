import type { commandType, handler } from "../Types/slashCommand";
import { eventOptions, events } from "../util/event";

async function provider(params: string[]): Promise<handler> {
    // console.log("Switching LLM provider...");
    events.emit(eventOptions.LLMProvider)
    return { status: 200, success: true, message: "LLM provider switched successfully" };
}

const providerCommand = {
    command: "/provider",
    description: "select your LLM provider",
    handler: provider,
    isDev: true,
    skipMessage: true
};

export default providerCommand;