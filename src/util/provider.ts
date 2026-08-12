import axios from "axios";

export type ProviderType = {
    name: string;
    listModel: (key: string) => Promise<string[]>;
};

const provider: Record<string, ProviderType> = {
    ollama: {
        name: "Ollama",

        listModel: async (key: string): Promise<string[]> => {
            const response = await axios.get("http://localhost:11434/api/tags");

            return response.data.models.map((model: any) => model.name);
        },
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
    },

    // https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_API_KEY
    gemini: {
        name: "Gemini",

        listModel: async (key: string): Promise<string[]> => {
            const response = await axios.get("https://generativelanguage.googleapis.com/v1beta/models?key=" + key);

            return response.data.models
                .filter((model: any) => model.supportedGenerationMethods?.includes("generateContent"))
                .map((model: any) => model.name.replace("models/", ""));
        },
    },
};

export default provider;
