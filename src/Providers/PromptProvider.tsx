import React, { createContext, useContext, useMemo, useState } from "react";
import { useAgentContext } from "./AgentProvider";
import { useSettingsContext } from "./SettingsProvider";
import AgentRunner from "../Scheduler/AgentRunner";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type AppContextType = {
    messages: Message[];
    handleSubmit: (input: string) => void;
    status: string | null;
};

const AppContext = createContext<AppContextType | null>(null);

// function createDummyResponse(prompt: string) {
//     const responses = [
//         "That sounds like a solid task. I can help you tackle it step by step.",
//         "Here is a practical approach to get you moving quickly.",
//         "I will draft a simple plan and keep the implementation lightweight.",
//         "This looks doable. I will suggest a focused solution for now.",
//     ];

//     const randomReply = responses[Math.floor(Math.random() * responses.length)];

//     const trimmedPrompt = prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;

//     return `${randomReply} You asked: "${trimmedPrompt}"`;
// }

export default function PromptContext({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [status, setStatus] = useState<string | null>(null);

    const { selectedAgent, agents, mode } = useAgentContext();
    const { commands, refreshSettings } = useSettingsContext();
    const { settings } = useSettingsContext();
    // run the respective handler for each command
    const handleSlashCommand = async (input: string) => {
        const [command, ...params] = input.trim().split(" ");

        const matchingCommand = commands.find((cmd) => cmd.command === command);

        if (matchingCommand) {
            const res = await matchingCommand.handler(params);
            refreshSettings();
            return res;
        }
        return { status: 404, success: false, message: "Command not found" };
    };

    const handleSubmit = async (input: string) => {
        const trimmedPrompt = input.trim();

        if (!trimmedPrompt) return;

        setMessages((prev) => [...prev, { role: "user", content: trimmedPrompt }]);

        if (trimmedPrompt.startsWith("/")) {
            const handled = await handleSlashCommand(trimmedPrompt);

            if (!handled || !handled.success || handled.error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `${handled?.error ?? handled?.message ?? "cannot execute command, something went wrong"}`,
                    },
                ]);
                return;
            }

            if (handled.data) {
                const { message, data, ...rest } = handled;
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: `${handled.message}\n\n${JSON.stringify(data, null, 2)}`,
                    },
                ]);
                return;
            }

            return;
        }

        if (!agents[selectedAgent]) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "No agent selected",
                },
            ]);
            setStatus(null);
            return;
        }

        setStatus(`running ${agents[selectedAgent].name}...`);

        let output = "";
        let isFirst = true;

        for await (const chunk of AgentRunner({
            agent: agents[selectedAgent],
            task: trimmedPrompt,
        })) {
            output += chunk;

            setMessages((prev) => {
                const copy = [...prev];
                if(isFirst) {
                    isFirst = false;
                    return [...copy, { role: "assistant", content: output }];
                }

                const last = copy.at(-1);

                if (!last) return copy;

                last.content = output;

                return copy;
            });
        }

        setStatus(null);
    };

    const value = useMemo<AppContextType>(
        () => ({
            messages,
            handleSubmit,
            status,
        }),
        [messages, handleSubmit, status]
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
