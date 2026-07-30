import React, { createContext, useContext, useMemo, useState } from "react";
import { useKeyboard } from "@opentui/react";

type Agent = {
    name: string;
    command: string;
};

const agents: Agent[] = [
    { name: "GPT-5", command: "gpt" },
    { name: "Claude", command: "claude" },
    { name: "Gemini", command: "gemini" },
];

type AppContextType = {
    selectedAgent: number;
    agents: Agent[];
    mode: mode;
};

type mode = "plan" | "code";

const AppContext = createContext<AppContextType | null>(null);

export default function AgentProvider({ children }: { children: React.ReactNode }) {
    const [selectedAgent, setSelectedAgent] = useState(0);
    const [mode, setMode] = useState<mode>("code");

    const selectNextAgent = () => {
        setSelectedAgent((prev) => (prev === agents.length - 1 ? 0 : prev + 1));
    };

    const selectPreviousAgent = () => {
        setSelectedAgent((prev) => (prev === 0 ? agents.length - 1 : prev - 1));
    };

    useKeyboard((key) => {
        if (key.name === "tab" && key.shift) {
            setMode((prev) => (prev === "code" ? "plan" : "code"));
            return;
        }

        switch (key.name) {
            case "left":
            case "up":
                selectPreviousAgent();
                break;

            case "right":
            case "down":
                selectNextAgent();
                break;
        }
    });

    const value = useMemo(
        () => ({
            selectedAgent,
            agents,
            mode,
        }),
        [selectedAgent, agents, mode]
    );

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAgentContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error("useAgentContext must be used inside AgentProvider");
    }

    return context;
}
