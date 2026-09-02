import { END, START, StateGraph, StateSchema, type GraphNode } from "@langchain/langgraph";
import z from "zod";
import { read } from "../util/read";
import provider from "../util/provider";
import { SystemMessage } from "langchain";

const graphState = new StateSchema({
    userPrompt: z.string().describe("The user's prompt or request to the system."),
    executionStep: z.string().describe("task that needed to be executed by the agent"),
    goalComplete: z.boolean().describe("Indicates whether the overall goal has been completed."),
});

const graph = new StateGraph(graphState);

// configuring model
const settingsString = await read();

if (!settingsString.success) {
    throw Error(settingsString.error);
}

const settings = JSON.parse(settingsString.data as string);


const model = provider[settings.model.provider]?.getLLM(settings.model.name, settings.model.api_key);

if (!model) {
    throw Error("Model not found");
}

const scheduleAgentSystemMessage = new SystemMessage(`
    You are a software task orchestrator.

    Your job is to plan the next executable job.

    INPUT:
    - the users requested prompt
    - task summary up til now

    OUTPUT (JSON only):
    {
        task:string,
        goalComplete:boolean
    }

    YOUR JOB:
    - analyze the users prompt and the task summary
    - determine if the users goal is complete
    - if the users goal is complete, return goalComplete = true and task = ""
    - if the users goal is not complete, return goalComplete = false and task = "next_executable_task"


    RULES:

    1. Return ONLY the next executable job.
    2. Stay strictly within the user's requested scope don't try to expand it beyond that.
    3. if summary is empty that means this is the first task, so return the first executable task.
    4. return a valid JSON string with only the keys task and goalComplete. Do not include any other keys or values.
`)


const scheduleNode:GraphNode<typeof graphState> = async (state) => {
    console.log("agent thinking...");
    const response = await model.invoke([scheduleAgentSystemMessage, state.userPrompt]);
    const output = JSON.parse(response.content.toString());
    console.log(output)
    return {
        userPrompt: state.userPrompt,
        executionStep: output.task,
        goalComplete: output.goalComplete,
    };
}

graph.addNode("scheduleNode", scheduleNode);

// @ts-ignore
graph .addEdge(START, "scheduleNode");
// @ts-ignore
graph .addEdge("scheduleNode", END);


const scheduleAgent = graph.compile();

export { scheduleAgent };
