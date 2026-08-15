import React, { createContext, useContext, useMemo, useState } from "react";
import { useAgentContext } from "./AgentProvider";
import { useSettingsContext } from "./SettingsProvider";
import AgentRunner from "../Scheduler/AgentRunner";
import inject from "../contextEngine/inject";

type Message = {
    role: "user" | "assistant";
    content: string;
};

type AppContextType = {
    messages: Message[];
    handleSubmit: (input: string) => void;
    agentResponse: string | null;
};

const AppContext = createContext<AppContextType | null>(null);

export default function PromptContext({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([]);
    // const [status, setStatus] = useState<string | null>(null);
    const [agentResponse, setAgentResponse] = useState<string | null>(null);

    const { selectedAgent, agents } = useAgentContext();
    const { commands, refreshSettings, settings } = useSettingsContext();
    // const { settings } = useSettingsContext();

    // run the respective handler for each command
    const handleSlashCommand = async (input: string) => {
        const [command, ...params] = input.trim().split(" ");

        const matchingCommand = commands.find((cmd) => cmd.command === command);

        if (matchingCommand) {
            const res = await matchingCommand.handler(params);
            refreshSettings();
            return matchingCommand.skipMessage ? { ...res, skipMessage: true } : res;
        }
        return { status: 404, success: false, message: "Command not found" };
    };

    const handleSubmit = async (input: string) => {
        const trimmedPrompt = input.trim();

        if (!trimmedPrompt) return;

        setMessages((prev) => [...prev, { role: "user", content: trimmedPrompt }]);

        await inject(trimmedPrompt, settings.model);

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
            if ("skipMessage" in handled && handled.skipMessage) {
                setMessages((prev) => prev.slice(0, -1));
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

        if (settings.model.provider === "NA" || settings.model.name === "NA") {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Please add model, and to do that run /model command",
                },
            ]);
            return;
        }

        if (agents[selectedAgent]?.cmd === "NA" && agents[selectedAgent]?.when === "NA" && agents[selectedAgent]?.name === "NA") {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Please add agent, and to do that run /agent add command",
                },
            ]);
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
            return;
        }

        setAgentResponse(`running ${agents[selectedAgent].name}...`);

        let output = "";

        for await (const chunk of AgentRunner({
            agent: agents[selectedAgent],
            task: trimmedPrompt,
        })) {
            output += chunk;
            setAgentResponse(output);
        }

        setMessages((prev) => [...prev, { role: "assistant", content: output }]);
        setAgentResponse(null);
    };

    const value = useMemo<AppContextType>(
        () => ({
            messages,
            handleSubmit,
            agentResponse,
        }),
        [messages, handleSubmit, agentResponse]
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
