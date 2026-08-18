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


    const agentPrompt = await humanMessage.format({task, summary: data.data}); 

    const messages = [new HumanMessage(agentPrompt)];

    console.log("fetching context...");
    const res = await retrieveAgent.invoke({messages});

    // const JSONgOutput = JSON.stringify(res.messages.at(-1)?.content, null, 2); 
    const JSONgOutput = JSON.parse(res.messages.at(-1)?.content as string);
    console.log(JSONgOutput.message);
}

const humanMessage = new PromptTemplate({
    template: `task: {task}\nsummary: {summary}`,
    inputVariables: ["task", "summary"],
});
