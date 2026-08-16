import { COMPRESSED_JSON, CONTEXT_DB, SESSION_SIZE } from "../constant";
import { read } from "../util/read";
import { write } from "../util/write";
import { injectAgent, injectAgentSystemMessage } from "./agents/inject";
import LLM from "./LLM";
import { HumanMessage } from "langchain";
import { v4 as uuidv4 } from "uuid";
import { Database } from "bun:sqlite";

export default async function inject(input: string, settings: { name: string; provider: string; api_key: string }, task: string) {
    try {
        const model = LLM(settings);    // fetching your setting and setting up your LLM

        if (!model) {
            throw new Error("Model not found");
        }

        const agent = injectAgent(model);   // converting your LLM to agent

        const message = [injectAgentSystemMessage, new HumanMessage(input)];

        const response = await agent.invoke(message);

        const id = uuidv4();

        await Promise.all([saveSummary(id, response.content, task), saveContext(id, input, task)]);
    } catch (error) {
        console.error(error);
    }
}

async function saveSummary(Id: string, summary: string, task: string) {
    const newData = {
        task_summary: summary,
        task_id: Id,
        users_task: task,
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

async function saveContext(id: string, context: string, task: string) {
    const db = new Database(CONTEXT_DB);

    // Creates the table only if it doesn't already exist
    db.run(`
    CREATE TABLE IF NOT EXISTS contexts (
      id TEXT PRIMARY KEY,
      context TEXT NOT NULL,
      users_task TEXT NOT NULL
    )
  `);

    // Insert the context
    db.run(`INSERT INTO contexts (id, context, users_task) VALUES (?, ?, ?)`, [id, context, task]);

    db.close();
}
