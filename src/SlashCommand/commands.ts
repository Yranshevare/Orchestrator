import AddAgentCommand from "./addAgent";
import ExitCommand  from "./exit";
import ModelCommand from "./model";
import type { commandType } from "./Type";


const commands: commandType[] = [ExitCommand, ModelCommand, AddAgentCommand];

export default commands;
