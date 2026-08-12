import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useKeyboard } from "@opentui/react";
import { useSettingsContext } from "./SettingsProvider";

type AppContextType = {
    selectedAgent: number;
    agents: { name: string; cmd: string; when: string }[];
    mode: mode;
};

type mode = "Plan" | "Code";

const AppContext = createContext<AppContextType | null>(null);

export default function AgentProvider({ children }: { children: React.ReactNode }) {
    const [selectedAgent, setSelectedAgent] = useState(0);
    const [mode, setMode] = useState<mode>("Code");
    const { settings } = useSettingsContext();
    const { filteredCommand } = useSettingsContext();
    const {isModelOpen, isProviderOpen} = useSettingsContext()

    const agents = settings.agents
        ? Object.entries(settings.agents).map(([name, agent]) => ({
              name,
              ...agent,
          }))
        : [];

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
            setMode((prev) => (prev === "Code" ? "Plan" : "Code"));
            return;
        }

        if (filteredCommand.length > 0 || isModelOpen || isProviderOpen) return;

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

    const value: AppContextType = useMemo(
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
