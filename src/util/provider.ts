import axios from "axios";
import { ChatOllama } from "@langchain/ollama";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export type ProviderType = {
    name: string;
    listModel: (key: string) => Promise<string[]>;
    getLLM: (model: string, api_key: string) => ChatOllama | ChatGoogleGenerativeAI;
    isDev?: boolean;
};

const provider: Record<string, ProviderType> = {
    ollama: {
        name: "Ollama",

        listModel: async (key: string): Promise<string[]> => {
            const response = await axios.get("http://localhost:11434/api/tags");

            return response.data.models.map((model: any) => model.name);
        },
        getLLM: (model: string, api_key: string) =>
            new ChatOllama({
                model: model,
                temperature: 0,
                think: false,
            }),
    },

    openAI: {
        name: "OpenAI",

        listModel: async (key: string): Promise<string[]> => {
            const response = await axios.get("https://api.openai.com/v1/models", {
                headers: {
                    Authorization: `Bearer ${key}`,
                },
            });

            return response.data.data.filter((model: any) => model.id.startsWith("gpt-")).map((model: any) => model.id);
        },
        getLLM: (model: string, api_key: string) =>
            new ChatOllama({
                model: model,
                temperature: 0,
                think: false,
            }),
        isDev: true,
    },

    // https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
    Gemini: {
        name: "Gemini",

        listModel: async (key: string): Promise<string[]> => {
            const response = await axios.get("https://generativelanguage.googleapis.com/v1beta/models?key=" + key);

            return response.data.models
                .filter((model: any) => model.supportedGenerationMethods?.includes("generateContent"))
                .map((model: any) => model.name.replace("models/", ""));
        },
        getLLM: (model: string, api_key: string) =>
            new ChatGoogleGenerativeAI({
                model: model,
                temperature: 0,
                apiKey: api_key,
            }),
    },
};

if(process.env.RUNTIME !== "dev"){
    Object.entries(provider).forEach(([key, value]) => {
        if (value.isDev) {
            delete provider[key];
            console.log(value.name);
        }
    })
}


export default provider;
