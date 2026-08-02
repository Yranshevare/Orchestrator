import { read } from "../util/read";
import type { handler } from "./Type";

async function agent(params: string[]): Promise<handler> {
    const settingsString = await read();
    if(!settingsString.success) {
        return {
            status: 500,
            success: false,
            message: "agents not found",
            error: settingsString.error,
        };
    }

    const settings = JSON.parse(settingsString.data as string);

    if (!settings.agents || Object.keys(settings.agents).length === 0) {
        return {
            status: 404,
            success: false,
            message: "No agents found.",
        };
    }

    if (params.length > 1) {
        return {
            status: 400,
            success: false,
            message: "Invalid number of arguments.",
        };
    }

    if (params.length === 1) {
        const agentKey: string = params[0] as string;
        if (!settings.agents[agentKey]) {
            return {
                status: 404,
                success: false,
                message: "Agent not found.",
            };
        }
        return {
            status: 200,
            success: true,
            message: `Agent retrieved successfully.`,
            data: { [agentKey]: settings.agents[agentKey] },
        };
    }

    return {
        status: 200,
        success: true,
        message: `Agents retrieved successfully.`,
        data: settings.agents,
    };
}

const AgentCommand = {
    command: "/agent",
    description: "Display agent information",
    handler: agent,
};

export default AgentCommand;
