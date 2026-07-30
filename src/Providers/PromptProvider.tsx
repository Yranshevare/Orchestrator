import React, { createContext, useContext, useMemo, useState } from "react";
import { useKeyboard } from "@opentui/react";
import { useAgentContext } from "./AgentProvider";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type AppContextType = {
    messages: Message[];
    handleSubmit: (input: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

function createDummyResponse(prompt: string) {
    const responses = [
        "That sounds like a solid task. I can help you tackle it step by step.",
        "Here is a practical approach to get you moving quickly.",
        "I will draft a simple plan and keep the implementation lightweight.",
        "This looks doable. I will suggest a focused solution for now.",
    ];

    const randomReply = responses[Math.floor(Math.random() * responses.length)];

    const trimmedPrompt = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;

    return `${randomReply} You asked: "${trimmedPrompt}"`;
}

export default function PromptContext({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);

    const { selectedAgent, agents } = useAgentContext();

    const handleSubmit = async (input: string) => {
        const trimmedPrompt = input.trim();

        if (!trimmedPrompt) return;

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: trimmedPrompt,
            },
        ]);

        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate agent call

        setMessages((prev) => [
            ...prev,
            {
                role: "assistant",
                content: `${createDummyResponse(trimmedPrompt)}, agent: ${agents[selectedAgent]?.name}`,
            },
        ]);
    };

    const value = useMemo<AppContextType>(
        () => ({
            messages,
            handleSubmit,
        }),
        [messages, handleSubmit]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function usePromptContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("usePromptContext must be used inside PromptContext");
    }

    return context;
}
