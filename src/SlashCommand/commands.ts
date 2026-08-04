import AddAgentCommand from "./addAgent";
import AgentCommand from "./agent";
import DeleteAgentCommand from "./deleteAgent";
import ExitCommand from "./exit";
import ModelCommand from "./model";
import type { commandType } from "./Type";
import UpdateAgentCommand from "./updateAgent";

const isDev = process.env.RUNTIME === "dev";

const commandList: commandType[] = [ExitCommand, ModelCommand, AddAgentCommand, UpdateAgentCommand, AgentCommand, DeleteAgentCommand]

const commands: commandType[] = [];

if (isDev) {
    commands.push(...commandList);
}else{
    commands.push(...commandList.filter(cmd => !cmd.isDev));
}


export default commands;
