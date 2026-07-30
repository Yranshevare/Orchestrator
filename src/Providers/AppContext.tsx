import React from "react";
import AgentProvider from "./AgentProvider";
import PromptContext from "./PromptProvider";

export function AppProvider({ children }: { children: React.ReactNode }) {
    return (
        <AgentProvider>
            <PromptContext>{children}</PromptContext>
        </AgentProvider>
    );
}
