import { eventOptions, events } from "../util/event";
import type { commandType, handler } from "../Types/slashCommand";
import { read } from "../util/read";

async function model(params: string[]): Promise<handler> {
    const settingsString = await read();

    
    
    if (settingsString.status === 404 ) return { status: 500, success: false, message: "settings not found", error: "please add provider, and to do that run /provider command" };

    const settings = JSON.parse(settingsString.data as string);
    if (settings.model.provider   === undefined || settings.model.provider === "NA") return { status: 404, success: false, message: "please add provider, and to do that run /provider command" };
    events.emit(eventOptions.LLMModel);
    // console.log("Switching AI model...");
    return { status: 200, success: true, message: "AI model switched successfully" };
}

const ModelCommand: commandType = {
    command: "/model",
    description: "Switch the AI model",
    handler: model,
    skipMessage: true
};

export default ModelCommand;
