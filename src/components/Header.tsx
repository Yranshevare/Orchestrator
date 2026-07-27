import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";

export function Header() {
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
      <text attributes={TextAttributes.BOLD} fg={theme.primary}>⚡ Orchestrator</text>
      <text fg={theme.secondary}>AI • ready to assist</text>
    </box>
  );
}
