import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";

export function StatusBar() {
    return (
        <box height={2} marginTop={1}  justifyContent="space-between" alignItems="center" paddingLeft={2} paddingRight={2} flexDirection="row">
            <text fg={theme.info} >↑↓ Agent: Focus</text>
            <text fg={theme.muted} >Enter ↵ send • Ctrl+C exit</text>
        </box>
    );
}
