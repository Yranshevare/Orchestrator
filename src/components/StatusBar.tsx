import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";
import { useAgentContext } from "../Providers/AgentProvider";
import { useSettingsContext } from "../Providers/SettingsProvider";

export function StatusBar() {
    const { mode } = useAgentContext();
    const { settings } = useSettingsContext();

    return (
        <box height={2} paddingX={2} marginTop={1} width="100%"  flexDirection="row"  justifyContent="space-between">
            <box flexDirection="row" alignItems="center" gap={1}>
                <text attributes={TextAttributes.BOLD} fg={mode === "Plan" ? theme.success : theme.warning}>
                    {mode}
                </text>

                <text fg={theme.secondary}>◆</text>

                <text fg={theme.muted} attributes={TextAttributes.BOLD}>{settings.model.name}</text>
            </box>

            <text fg={theme.muted}>Enter ↵ Send • /exit Exit</text>
        </box>
    );
}
