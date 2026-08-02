import AddAgentCommand from "./addAgent";
import AgentCommand from "./agent";
import ExitCommand  from "./exit";
import ModelCommand from "./model";
import type { commandType } from "./Type";
import UpdateAgentCommand from "./updateAgent";


const commands: commandType[] = [ExitCommand, ModelCommand, AddAgentCommand, UpdateAgentCommand, AgentCommand];

export default commands;
