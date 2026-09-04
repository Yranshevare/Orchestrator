import { END, START, StateGraph, StateSchema, type GraphNode } from "@langchain/langgraph";
import z from "zod";
import model from "./LLM";
import { scheduleAgentSystemMessage } from "./prompts";

const jobState = z.object({
    task: z.string().describe("The specific task that needs to be executed by the agent."),
    agent: z.string().describe("The name or identifier of the agent responsible for executing the task."),
});

const graphState = new StateSchema({
    userPrompt: z.string().describe("The user's prompt or request to the system."),
    executionStep: z.array(jobState),
    goalComplete: z.boolean().describe("Indicates whether the overall goal has been completed."),
});

const graph = new StateGraph(graphState);

const scheduleNode: GraphNode<typeof graphState> = async (state) => {
    console.log("agent thinking...");

    // to resolve a type error
    if (!model) {
        throw Error("Model not found");
    }

    const response = await model.invoke([scheduleAgentSystemMessage, state.userPrompt]);

    const output = JSON.parse(response.content.toString());

    console.log(output);

    return {
        executionStep: output.job,
        goalComplete: output.goalComplete,
    };
};

graph.addNode("scheduleNode", scheduleNode);

const agentRunner: GraphNode<typeof graphState> = async (state) => {
    return state;
};

// @ts-ignore
graph.addEdge(START, "scheduleNode");
// @ts-ignore
graph.addEdge("scheduleNode", END);

const scheduleAgent = graph.compile();

export { scheduleAgent };


/*
SOME TEST CASES FOR THE SCHEDULER:

Build a todo app with a React frontend, Node.js API, PostgreSQL database, and tests.

Add user authentication to my application.

Add dark mode to the React application.\

Fix the bug where users get logged out after refreshing the page.

Refactor the payment module and add tests without changing its behavior.

Build a REST API for managing products and add integration tests.

Add a profile page where users can view and edit their name and email.

Build a search feature with backend search API, frontend search UI, and tests.

Fix the broken submit button on the registration form.

Add pagination and sorting to the product API.

Containerize the application and set up CI to run tests on every pull request.

*/