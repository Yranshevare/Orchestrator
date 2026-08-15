import { ChatOllama } from "@langchain/ollama";

type llmFun = (apiKey: string, name: string) => any;

const llm: Record<string, llmFun> = {
    ollama: (apiKey: string, name: string): ChatOllama => {
        return new ChatOllama({
            model: name,
            temperature: 0,
            think: false,
        });
    },
};

export default function getLLM(provider: string, apiKey: string, name: string): ChatOllama {
    if (!provider) {
        throw new Error("No LLM name provided");
    }

    if (!llm[provider]) {
        throw new Error("LLM not found");
    }

    return llm[provider](apiKey, name);
}
