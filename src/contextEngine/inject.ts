import { COMPRESSED_JSON, SESSION_SIZE } from "../constant";
import { read } from "../util/read";
import { write } from "../util/write";
import { injectAgent, injectAgentSystemMessage } from "./agents/inject";
import LLM from "./LLM";
import { HumanMessage } from "langchain";
import { v4 as uuidv4 } from "uuid";

export default async function inject(input: string, settings: { name: string; provider: string; api_key: string }) {
    try {
        const model = LLM(settings);    // fetching your setting and setting up your LLM

        if (!model) {
            throw new Error("Model not found");
        }

        const agent = injectAgent(model);   // converting your LLM to agent

        const message = [injectAgentSystemMessage, new HumanMessage(input)];

        const response = await agent.invoke(message);

        const id = uuidv4();

        await saveSummary(id, response);
    } catch (error) {
        console.error(error);
    }
}

async function saveSummary(Id: string, summary: string) {
    const newData = {
        task_summary: summary,
        task_id: Id,
    };

    const compressed = await read(COMPRESSED_JSON);

    if (compressed.status !== 404 && !compressed.success && compressed.error) {
        throw new Error(compressed.error);
    }

    let compressedData = compressed.data ? JSON.parse(compressed.data) : [];

    compressedData.push(newData);

    compressedData = compressedData.slice(-SESSION_SIZE);

    await write(JSON.stringify(compressedData, null, 2), COMPRESSED_JSON);
}
