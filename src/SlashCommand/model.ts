import type { commandType, handler } from "./Type";

async function model(params: string[]):Promise<handler> {
    console.log("Switching AI model...");
    return { status: 200, success: true, message: "AI model switched successfully", data: params };
}

const ModelCommand: commandType = {
    command: "/model",
    description: "Switch the AI model",
    handler: model,
};

export default ModelCommand;