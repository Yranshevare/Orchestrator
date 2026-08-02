import parseFlags from "../handler/commandPaser";
import { read } from "../util/read";
import { write } from "../util/write";
import type { commandType, handler } from "./Type";

async function updateAgent(params: string[]): Promise<handler> {
    const args = parseFlags(params);
    console.log("Parsed args:", args);

    // Validate required key
    if (typeof args.key !== "string" || args.key.trim() === "") {
        return {
            status: 400,
            success: false,
            message: "Missing required argument: --key",
        };
    }

    args.key = args.key.trim();

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
        if (!["key", "name", "cmd", "when"].includes(key)) {
            return {
                status: 400,
                success: false,
                message: `Invalid argument: --${key}`,
            };
        }
    }

    // Validate optional fields
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
    const settings = JSON.parse(settingsString.data as string);

    // Check agent exists
    if (!settings.agents[args.key]) {
        return {
            status: 404,
            success: false,
            message: "Agent not found.",
        };
    }

    // Prevent duplicate agent names
    if (args.name && args.name !== args.key && settings.agents[args.name]) {
        return {
            status: 409,
            success: false,
            message: `Agent "${args.name}" already exists.`,
        };
    }

    // Update fields
    if (args.cmd) settings.agents[args.key].cmd = args.cmd;
    if (args.when) settings.agents[args.key].when = args.when;

    // Rename agent
    if (args.name) {
        settings.agents[args.name] = settings.agents[args.key];
        delete settings.agents[args.key];
    }

    await write(JSON.stringify(settings, null, 2));

    return {
        status: 200,
        success: true,
        message: "Agent updated successfully",
        data: args,
    };
}

const UpdateAgentCommand: commandType = {
    command: "/agent-update",
    description: "--key <original-agent-name> --name <new-agent-name> --cmd <launch-command> --when <when-to-use>",
    handler: updateAgent,
};

export default UpdateAgentCommand;
