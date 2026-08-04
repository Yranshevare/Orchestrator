import { read } from "../util/read";
import { write } from "../util/write";
import type { commandType, handler } from "../Types/slashCommand";

async function deleteAgent(params: string[]): Promise<handler> {
    const str = params.join(" ");
    const matches = [...str.matchAll(/"([^"]*)"|(\S+)/g)];
    const args: [string, string, string] = matches.map((match) => match[1] ?? match[2]) as [string, string, string];

    if (args.length < 1) {
        return {
            status: 400,
            success: false,
            message: "invalid arguments.\nsyntax: /agent-delete <name>",
        };
    }

    const settingsString = await read();
    if (!settingsString.success) {
        return {
            status: 500,
            success: false,
            message: "agents not found",
            error: settingsString.error,
        };
    }
    const settings = JSON.parse(settingsString.data as string);

    let agents: { str: string; data: { [key: string]: string } } = { str: "", data: {} };

    args.forEach((agentKey) => {
        if (!settings.agents[agentKey]) {
            return {
                status: 404,
                success: false,
                message: "Agent not found.",
            };
        }
        agents.str += agentKey + " ";
        agents.data[agentKey] = settings.agents[agentKey];
        delete settings.agents[agentKey];
    });

    console.log("Updated settings after deletion:", settings);

    const res = await write(JSON.stringify(settings, null, 2));

    if (!res.success) {
        return {
            status: 500,
            success: false,
            message: "Failed to update settings.",
            error: res.error,
        };
    }

    return {
        status: 200,
        success: true,
        message: `${agents.str.trim()} deleted successfully.`,
        data: agents.data,
    };
}

const DeleteAgentCommand = {
    command: "/agent-delete",
    description: "Delete an agent: /agent-delete <name>",
    handler: deleteAgent,
};

export default DeleteAgentCommand;
