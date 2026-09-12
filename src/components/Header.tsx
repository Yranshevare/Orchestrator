import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";
import { useAgentContext } from "../Providers/AgentProvider";
import { useSettingsContext } from "../Providers/SettingsProvider";

export function Header() {
    const { agents, selectedAgent } = useAgentContext();
    const { orchestrationMode } = useSettingsContext();
    return (
        <box
            height={3}
            borderStyle="double"
            borderColor={theme.border}
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            paddingLeft={2}
            paddingRight={2}
        >
            <text attributes={TextAttributes.BOLD} fg={theme.primary}>
                ⚡ Orchestrator
            </text>
            <text
                fg={theme.secondary}
                opacity={orchestrationMode ? 0.5 : 1}
                attributes={orchestrationMode ? TextAttributes.STRIKETHROUGH : undefined}
            >
             ↑↓ Agent: {agents[selectedAgent]?.name ?? "No agent selected"}
            </text>
        </box>
    );
}
