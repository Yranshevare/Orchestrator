import { SystemMessage } from "langchain";
import { CONTEXT_DB, SESSION_SIZE } from "../../constant";
import z from "zod";
import {
    Annotation,
    END,
    MessagesValue,
    ReducedValue,
    START,
    StateGraph,
    StateSchema,
    type ConditionalEdgeRouter,
    type GraphNode,
} from "@langchain/langgraph";
import { AIMessage, BaseMessage } from "@langchain/core/messages";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { Database } from "bun:sqlite";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import { read } from "../../util/read";
import LLM from "../LLM";

const retrieveAgentSystemMessage = new SystemMessage(`
Determine whether additional context is needed to complete the user's task.

You have a compressed summary of the last ${SESSION_SIZE} tasks, with IDs for retrieving their full context.

- If no summery is available, means its the first task.
- summery is in JSON string format
- No retrieval if the task can be completed as-is.
- If the summary is insufficient, retrieve only the relevant previous context using its IDs.
- Retrieve only the minimum context necessary to complete the task.
- If no relevant context can be found, return an error indicating that the task cannot be completed due to missing context.

Return ONLY a self-contained prompt for a coding agent to complete the user's task in a fresh session. Do not include explanations or reasoning.
`);
// const retrieveAgentSystemMessage = new SystemMessage(`
// Determine whether additional context is needed to complete the user's task.

// You have a compressed summary of the last ${SESSION_SIZE} tasks, with IDs for retrieving their full context.

// - No retrieval if the task can be completed as-is.
// - If the task can be completed using the summary alone, do not retrieve anything.
// - If the summary is insufficient, retrieve only the relevant previous context using its IDs.
// - If previous tasks are irrelevant but additional context is required, use RAG search.
// - Retrieve only the minimum context necessary to complete the task.

// Return ONLY a self-contained prompt for a coding agent to complete the user's task in a fresh session. Do not include explanations or reasoning.
// `);

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
    console.log("agent thinking...")
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
