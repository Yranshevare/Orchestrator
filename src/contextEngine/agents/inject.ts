import { SystemMessage, HumanMessage, AIMessage } from "langchain";

const injectAgentSystemMessage = new SystemMessage(
    `
    You are a helpful assistant that summarizes text. Create a concise, information-dense summary that helps the reader determine whether a specific question can be answered from the original text. Include the key topics, facts, arguments, and conclusions needed to make that judgment. Do not add information that is not present in the original text.
    `
);

function injectAgent(model: any) {
    return model;
}

export { injectAgentSystemMessage, injectAgent };
