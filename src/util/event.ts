import { EventEmitter } from "node:events";

export const events = new EventEmitter();

export const eventOptions = {
    LLMProvider: "llm-provider",
    LLMModel: "llm-model",
}