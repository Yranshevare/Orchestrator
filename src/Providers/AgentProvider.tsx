import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useKeyboard } from "@opentui/react";
import { type Agent, useSettingsContext } from "./SettingsProvider";

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
    const { settings } = useSettingsContext();
    const {filteredCommand} = useSettingsContext()

    const agents = settings.agents;

    useEffect(() => {
        if (agents.length === 0) {
            setSelectedAgent(0);
            return;
        }

        setSelectedAgent((prev) => (prev >= agents.length ? 0 : prev));
    }, [agents.length]);

    const selectNextAgent = () => {
        setSelectedAgent((prev) => (prev >= agents.length - 1 ? 0 : prev + 1));
    };

    const selectPreviousAgent = () => {
        setSelectedAgent((prev) => (prev === 0 ? agents.length - 1 : prev - 1));
    };

    useKeyboard((key) => {
        if (key.name === "tab" && key.shift) {
            setMode((prev) => (prev === "code" ? "plan" : "code"));
            return;
        }

        if(filteredCommand.length > 0) return

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
