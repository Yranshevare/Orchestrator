import parseFlags from "../handler/commandPaser";
import { read } from "../util/read";
import { write } from "../util/write";
import type { commandType, handler } from "./Type";

async function updateAgent(params: string[]): Promise<handler> {
    const [name, ...rest] = params;
    const args = parseFlags(rest);

    // Validate required agent name
    if (typeof name !== "string" || name.trim() === "") {
        return {
            status: 400,
            success: false,
            message: "Missing required argument: <name>",
        };
    }

    const agentName = name.trim();

    // Ensure at least one field is provided
    if (args.name === undefined && args.cmd === undefined && args.when === undefined) {
        return {
            status: 400,
            success: false,
            message: "Provide at least one of: --name, --cmd, or --when",
        };
    }

    // Validate optional fields
    for (const key of Object.keys(args)) {
        if (!["name", "cmd", "when"].includes(key)) {
            return {
                status: 400,
                success: false,
                message: `Invalid argument: --${key}`,
            };
        }
    }

    // Validate optional field values
    for (const field of ["name", "cmd", "when"] as const) {
        const value = args[field];

        if (value !== undefined) {
            if (typeof value !== "string" || value.trim() === "") {
                return {
                    status: 400,
                    success: false,
                    message: `Invalid value for --${field}`,
                };
            }

            args[field] = value.trim();
        }
    }

    const settingsString = await read();

    if (!settingsString.success) {
        return {
            status: 500,
            success: false,
            message: "Agents not found.",
            error: settingsString.error,
        };
    }

    const settings = JSON.parse(settingsString.data as string);

    // Check agent exists
    if (!settings.agents[agentName]) {
        return {
            status: 404,
            success: false,
            message: "Agent not found.",
        };
    }

    // Prevent duplicate agent names
    if (args.name && args.name !== agentName && settings.agents[args.name]) {
        return {
            status: 409,
            success: false,
            message: `Agent "${args.name}" already exists.`,
        };
    }

    // Update fields
    if (args.cmd) settings.agents[agentName].cmd = args.cmd;
    if (args.when) settings.agents[agentName].when = args.when;

    // Rename agent
    if (args.name) {
        settings.agents[args.name] = settings.agents[agentName];
        delete settings.agents[agentName];
    }

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
        message: "Agent updated successfully.",
        data: {
            agent: args.name ?? agentName,
            cmd: args.cmd,
            when: args.when,
        },
    };
}

const UpdateAgentCommand: commandType = {
    command: "/agent-update",
    description: "<name> [--name <new-agent-name>] [--cmd <launch-command>] [--when <when-to-use>]",
    handler: updateAgent,
};

export default UpdateAgentCommand;
