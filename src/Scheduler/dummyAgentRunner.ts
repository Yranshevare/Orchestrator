import { SystemMessage } from "langchain";
import model from "./LLM";

const systemPrompt = new SystemMessage(`
You are a dummy coding agent used for testing a software task orchestrator.

Simulate the response of a real coding agent after successfully completing the assigned task.

Do NOT write or output code. Assume the task has already been implemented successfully.

Return a concise, natural-language completion message describing what was changed, relevant files or areas, and tests or verification performed when appropriate.

Do not mention that you are a dummy agent.
Do not explain the simulation.
Do not return JSON.
Do not use a fixed response template.
`);

export default async function dummyAgentRunner(prompt: string) {
    if (!model) {
        throw new Error("Model not found");
    }

    const response = await model.invoke([systemPrompt, new SystemMessage(`Assigned coding task:\n${prompt}`)]);

    return response.content;
}
