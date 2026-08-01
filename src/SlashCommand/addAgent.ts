import { keys } from "../constant";
import writeIntoSettings from "../handler/writeIntoSettings";
import { read } from "../util/read";
import type { commandType, handler } from "./Type";

async function addAgent(params: string[]): Promise<handler> {
    const str = params.join(" ");
    const matches = [...str.matchAll(/"([^"]*)"|(\S+)/g)];
    const args: [string, string, string] = matches.map((match) => match[1] ?? match[2]) as [string, string, string];

    if (args.length !== 3) {
        return {
            status: 400,
            success: false,
            message: 'invalid arguments.\nsyntax: /add-agent <name> "<launch-command>" "<when-to-use>"',
        };
    }

    const [name, cmd, when] = args;

    const data = {
        [name]: {
            cmd,
            when,
        },
    };

    const res = await writeIntoSettings({ key: keys.agents, data: data });
    // console.log("writeIntoSettings res:", res);

    if (!res.success) {
        return {
            status: 500,
            success: false,
            message: "Error writing to the settings file.",
            error: res.error || res.message,
        };
    }

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
    description: '/add-agent <name> "<launch-command>" "<when-to-use>"',
    handler: addAgent,
};

export default AddAgentCommand;
