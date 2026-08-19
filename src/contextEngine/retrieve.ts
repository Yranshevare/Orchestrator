import { HumanMessage } from "langchain";
import { COMPRESSED_JSON } from "../constant";
import { read } from "../util/read";
import LLM from "./LLM";
import { PromptTemplate } from "@langchain/core/prompts";
import { retrieveAgent } from "./agents/retrieve";

export default async function getContext(task: string) {
    const data = await read(COMPRESSED_JSON);

    if (data.status !== 404 && !data.success && data.error) {
        throw new Error(data.error);
    }

    const agentPrompt = await humanMessage.format({ task, summary: data.data });

    const messages = [new HumanMessage(agentPrompt)];

    // console.log("fetching context...");
    const res = await retrieveAgent.invoke({ messages });

    // console.log(res.messages.at(-1)?.content)

    // const JSONgOutput = JSON.stringify(res.messages.at(-1)?.content, null, 2);
    const content = res.messages.at(-1)?.content;

    if (typeof content !== "string") {
        throw new Error("Model did not return text content");
    }

    const JSONgOutput = parseModelJSON(content);

    console.log(JSONgOutput);
    return JSONgOutput;
}

const humanMessage = new PromptTemplate({
    template: `task: {task}\nsummary: {summary}`,
    inputVariables: ["task", "summary"],
});

function parseModelJSON(content: string) {
    let cleaned = content.trim();

    // Remove markdown code fences
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "");
    cleaned = cleaned.replace(/\s*```$/i, "");

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Failed to parse model JSON:");
        console.error(content);

        throw new Error(`Model returned invalid JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
}
