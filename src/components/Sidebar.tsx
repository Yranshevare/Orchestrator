import { TextAttributes } from "@opentui/core";
import { theme } from "../theme";

const chats = [
  { name: "New workspace", active: true },
  { name: "Backend refactor", active: false },
  { name: "Design polish", active: false },
  { name: "Release prep", active: false },
];

export function Sidebar() {
  return (
    <box width={28} borderStyle="single" borderColor={theme.border} flexDirection="column" padding={1}>
      <text attributes={TextAttributes.BOLD} fg={theme.primary}>Workspaces</text>
      <box height={1} />
      {chats.map(chat => (
        <text key={chat.name} fg={chat.active ? theme.secondary : theme.text}>
          {chat.active ? "●" : "○"} {chat.name}
        </text>
      ))}

      <box flexGrow={1} />

      <box borderStyle="single" borderColor={theme.border} padding={1} flexDirection="column">
        <text fg={theme.info}>Quick actions</text>
        <text fg={theme.text}>• Summarize repo</text>
        <text fg={theme.text}>• Plan a task</text>
      </box>
    </box>
  );
}
