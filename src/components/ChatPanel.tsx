import { usePromptContext } from "../Providers/PromptProvider";
import { theme } from "../theme";
import { AnimatedIcon } from "./AnimatedIcon";

export function ChatPanel() {
    const { messages, agentResponse } = usePromptContext();

    if (messages.length === 0) return Logo();

    return (
        <scrollbox stickyScroll stickyStart="bottom" width="100%" height="100%">
            {messages.map((message, i) => (
                <box key={i} flexDirection="column">
                    {message.role === "user" && (
                        <box backgroundColor={theme.inputBackground} paddingY={1}>
                            <text fg={theme.secondary} marginX={1}>
                                ▶ {message.content}
                            </text>
                        </box>
                    )}

                    {message.role === "assistant" && (
                        <box padding={1} marginLeft={3}>
                            <text fg={theme.text}>{message.content}</text>
                        </box>
                    )}

                </box>
            ))}
            {
                agentResponse && (
                    <box padding={1} marginLeft={3} flexDirection="row" gap={1}>
                        <AnimatedIcon frames={["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]} color={theme.muted}/>
                        <text fg={theme.text}>{agentResponse}</text>
                    </box>
                )
            }
        </scrollbox>
    );
}

export function Logo() {
    return (
        <box flexDirection="column" justifyContent="center" alignItems="center" height="100%">
            <box flexDirection="row">
                <text fg="white">{`
 ██████╗ ██████╗  ██████╗██╗  ██╗███████╗███████╗
██╔═══██╗██╔══██╗██╔════╝██║  ██║██╔════╝██╔════╝
██║   ██║██████╔╝██║     ███████║█████╗  ███████╗
██║   ██║██╔══██╗██║     ██╔══██║██╔══╝  ╚════██║
╚██████╔╝██║  ██║╚██████╗██║  ██║███████╗███████║
 ╚═════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝
                `}</text>

                <text fg={theme.warning}>{`
████████╗██████╗  █████╗ ████████╗ ██████╗ ██████╗
╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██╔═══██╗██╔══██╗
   ██║   ██████╔╝███████║   ██║   ██║   ██║██████╔╝
   ██║   ██╔══██╗██╔══██║   ██║   ██║   ██║██╔══██╗
   ██║   ██║  ██║██║  ██║   ██║   ╚██████╔╝██║  ██║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝
                `}</text>
            </box>

            <text fg={theme.muted}>AI Workflow & Multi-Agent Orchestration</text>
        </box>
    );
}
