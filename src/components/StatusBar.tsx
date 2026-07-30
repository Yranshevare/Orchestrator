import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";
import { useAgentContext } from "../Providers/AgentProvider";

export function StatusBar() {

    const {mode} = useAgentContext()
    return (
        <box height={2} marginTop={1}  justifyContent="space-between" alignItems="center" paddingLeft={2} paddingRight={2} flexDirection="row">
            <text fg={mode === "plan" ? theme.success : theme.warning} ># Mode: {mode}</text>
            <text fg={theme.muted} >Enter ↵ send • Ctrl+C exit</text>
        </box>
    );
}
