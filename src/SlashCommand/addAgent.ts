import parseFlags from "../handler/commandPaser";
import type { commandType, handler } from "./Type";

async function addAgent(params: string[]): Promise<handler> {
    const str = params.join(" ");
    const matches = [...str.matchAll(/"([^"]*)"|(\S+)/g)];
    const args = matches.map((match) => match[1] ?? match[2]);

    if (args.length !== 3) {
        return {
            status: 400,
            success: false,
            message: 'Usage: /add-agent <name> "<launch-command>" "<when-to-use>"',
        };
    }

    const [name, cmd, when] = args;

    return {
        status: 200,
        success: true,
        message: `${name} added successfully: `,
        data: {
            name,
            cmd,
            when,
        },
    };
}

const AddAgentCommand: commandType = {
    command: "/add-agent",
    description: "/add-agent <name> \"<launch-command>\" \"<when-to-use>\"",
    handler: addAgent,
};

export default AddAgentCommand;
