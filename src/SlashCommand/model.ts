import { eventOptions, events } from "../util/event";
import type { commandType, handler } from "../Types/slashCommand";

async function model(params: string[]):Promise<handler> {
    events.emit(eventOptions.LLMModel)
    // console.log("Switching AI model...");
    return { status: 200, success: true, message: "AI model switched successfully" };
}

const ModelCommand: commandType = {
    command: "/model",
    description: "Switch the AI model",
    handler: model,
    isDev: true
};

export default ModelCommand;