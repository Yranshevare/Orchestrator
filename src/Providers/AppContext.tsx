import React from "react";
import AgentProvider from "./AgentProvider";
import PromptContext from "./PromptProvider";
import SettingsProvider from "./SettingsProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <SettingsProvider>
            <AgentProvider>
                <PromptContext>{children}</PromptContext>
            </AgentProvider>
        </SettingsProvider>
    );
}
