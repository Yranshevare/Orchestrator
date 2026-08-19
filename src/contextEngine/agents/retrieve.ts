import { SystemMessage } from "langchain";
import { CONTEXT_DB } from "../../constant";
import z from "zod";
import { END, MessagesValue, START, StateGraph, StateSchema, type ConditionalEdgeRouter, type GraphNode } from "@langchain/langgraph";
import { AIMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { Database } from "bun:sqlite";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { read } from "../../util/read";
import LLM from "../LLM";

const retrieveAgentSystemMessage = new SystemMessage(`
You are a helpful hidden assistant (user must not know you exist) that sits between the user and a coding agent.

You have:
- a coding agent with no previous context
- previous task summaries with IDs (is list is empty, then its a first task)
- retrieveViaID to get full previous task context

Decide whether the request is:
1. A normal question -> answer directly, agent=false
2. A coding/task request -> create a prompt for the coding agent, agent=true

Rules:
- Try to answer simple questions directly.
- Try to avoid the coding agent when possible.
- Try not to retrieve previous context unless it is absolutely necessary.
- If previous context is required, use retrieveViaID with the relevant task ID.
- If the request is a coding/agent task, construct a prompt containing enough context for the coding agent to complete it.
- The coding agent has no prior conversation context, so include all relevant information.

Output ONLY valid JSON:
{
  "message": "string",
  "agent": true/false
}

For agent tasks:
- make sure the message is a valid prompt that can directly given to agent to complete the task.
- if agent task can be completed without any additional context, then return the users task as a prompt.
- if there is not enough context to complete the agent task then return error message.
- make sure you not sound like a coding assistant that has solve the task.
- You are NOT solving the user's coding task. You are writing a detailed instructions TO the coding agent.
`);

// test the agent with following prompts
// 1. at the root there is a demo folder in that folder create the js file and write a code of hello world (perfect)
// 2. can you change the code from hello world to hello orchestrator (perfect)
// 3. can you change the code from hello world to a implementation of higher order function (perfect)
// 4. can you tell what is this project about and its tech stack (not perfect:- tries to ans from summary)
// 5. create the node server that handle jwt based authentication (perfect)
// 6. add delete user endpoint (not perfect:- return the exact task)

const graphState = new StateSchema({
    messages: MessagesValue,
});

const graph = new StateGraph(graphState);

// tool to retrieve agent
const retrieveViaID = new DynamicStructuredTool({
    name: "Retrieve via ID",
    description: "Retrieves the context of a task by its ID.",
    schema: z.object({ id: z.string() }),
    func: async ({ id }) => {
        console.log("tool called: retrieveViaID");
        const db = new Database(CONTEXT_DB);
        const context = db.prepare(`SELECT context, users_task FROM contexts WHERE id = ?`).get(id);
        return context;
    },
});
const toolNode = new ToolNode([retrieveViaID]);

// adding tool node to graph
graph.addNode("toolNode", toolNode);

// configuring model
const settingsString = await read();


if (!settingsString.success) {
    throw Error(settingsString.error);
}

const settings = JSON.parse(settingsString.data as string);


const model = LLM(settings.model);

if (!model) {
    throw Error("Model not found");
}

// adding tool to model
const modelWithTools = model.bindTools([retrieveViaID]);

// converting model to a chatNode
const chatNode: GraphNode<typeof graphState> = async (state) => {
    console.log("agent thinking...");
    const response = await modelWithTools.invoke([retrieveAgentSystemMessage, ...state.messages]);
    return {
        messages: [response],
    };
};

graph.addNode("agent", chatNode);

// routing function for Tools and END
const shouldContinue: ConditionalEdgeRouter<{ InputSchema: typeof graphState; Nodes: "toolNode" }> = (state) => {
    const lastMessage = state.messages.at(-1);

    // Check if it's an AIMessage before accessing tool_calls
    if (!lastMessage || !AIMessage.isInstance(lastMessage)) {
        return END;
    }

    // If the LLM makes a tool call, then perform an action
    if (lastMessage.tool_calls?.length) {
        return "toolNode";
    }

    // Otherwise, we stop (reply to the user)
    return END;
};

// @ts-expect-error
graph.addEdge(START, "agent");

// @ts-expect-error
graph.addConditionalEdges("agent", shouldContinue, ["toolNode", END]);

// @ts-expect-error
graph.addEdge("toolNode", "agent");

const retrieveAgent = graph.compile();

export { retrieveAgentSystemMessage, retrieveAgent };
