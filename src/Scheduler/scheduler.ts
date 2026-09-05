import { END, START, StateGraph, StateSchema, type ConditionalEdgeRouter, type GraphNode } from "@langchain/langgraph";
import z from "zod";
import model from "./LLM";
import { scheduleAgentSystemMessage, summaryAgentSystemMessage } from "./prompts";
import dummyAgentRunner from "./dummyAgentRunner";

const jobState = z.object({
    task: z.string().describe("The specific task that needs to be executed by the agent."),
    agent: z.string().describe("The name or identifier of the agent responsible for executing the task."),
});

const graphState = new StateSchema({
    userPrompt: z.string().describe("The user's prompt or request to the system."),
    executionStep: z.array(jobState),
    goalComplete: z.boolean().describe("Indicates whether the overall goal has been completed."),
    output: z.array(z.string()).describe("The output or result of the executed tasks."),
    executionSummary: z.string().describe("A summary of the tasks executed so far and their outcomes."),
});

const graph = new StateGraph(graphState);

const scheduleNode: GraphNode<typeof graphState> = async (state) => {
    console.log("agent thinking...");

    // to resolve a type error
    if (!model) {
        throw Error("Model not found");
    }

    const prompt = `user prompt: ${state.userPrompt}\ntask summary so far: ${state.executionSummary}`;

    const response = await model.invoke([scheduleAgentSystemMessage, prompt]);

    const output = JSON.parse(response.content.toString());

    console.log(output);

    return {
        executionStep: output.job,
        goalComplete: output.goalComplete,
    };
};

graph.addNode("scheduleNode", scheduleNode);

const agentRunner: GraphNode<typeof graphState> = async (state) => {
    console.log("executing the task...");
    const output: string[] = await Promise.all(
        state.executionStep.map(async (job) => {
            const res = await dummyAgentRunner(job.task);
            return String(res);
        })
    );

    console.log("complete tasks", output.length);
    return {
        output: output,
    };
};

graph.addNode("agentRunner", agentRunner);

const summaryNode: GraphNode<typeof graphState> = async (state) => {
    console.log("summarizing the task...");

    // to resolve a type error
    if (!model) {
        throw Error("Model not found");
    }

    const prompt = `previous summary: ${state.executionSummary}\nagent output: ${state.output.join("\n")}`;

    const response = await model.invoke([summaryAgentSystemMessage, prompt]);
    console.log(response.content.toString());
    return {
        executionSummary: response.content.toString(),
    };
};

graph.addNode("summaryNode", summaryNode);

const updateExecutionSummary: GraphNode<typeof graphState> = async (state) => {
    return {
        executionSummary: state.output[0] || "",
    };
};

graph.addNode("updateExecutionSummary", updateExecutionSummary);

const shouldContinue: ConditionalEdgeRouter<{ InputSchema: typeof graphState; Nodes: "agentRunner" }> = (state) => {
    if (state.goalComplete) {
        return END;
    }
    return "agentRunner";
};

const shouldGiveToSummaryAgent: ConditionalEdgeRouter<{ InputSchema: typeof graphState; Nodes: "summaryNode" | "updateExecutionSummary" }> = (
    state
) => {
    if (state.output.length === 1 && state.executionSummary === "") {
        return "updateExecutionSummary";
    }
    return "summaryNode";
};

// @ts-ignore
graph.addEdge(START, "scheduleNode");

// @ts-ignore
graph.addConditionalEdges("scheduleNode", shouldContinue, ["agentRunner" , END]);

// @ts-ignore
graph.addConditionalEdges("agentRunner", shouldGiveToSummaryAgent, ["summaryNode", "updateExecutionSummary"]);

// @ts-ignore
graph.addEdge("updateExecutionSummary", "scheduleNode");

// @ts-ignore
graph.addEdge("summaryNode", "scheduleNode");

const scheduleAgent = graph.compile();

export { scheduleAgent };

/*
SOME TEST CASES FOR THE SCHEDULER:

Build a todo app with a React frontend, Node.js API, PostgreSQL database, and tests.

Add user authentication to my application.

Add dark mode to the React application.

Fix the bug where users get logged out after refreshing the page.

Refactor the payment module and add tests without changing its behavior.

Build a REST API for managing products and add integration tests.

Add a profile page where users can view and edit their name and email.

Build a search feature with backend search API, frontend search UI, and tests.

Fix the broken submit button on the registration form.

Add pagination and sorting to the product API.

Containerize the application and set up CI to run tests on every pull request.

*/
