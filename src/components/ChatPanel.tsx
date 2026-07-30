import { usePromptContext } from "../Providers/PromptProvider";
import { theme } from "../theme";

export function ChatPanel() {
    const { messages } = usePromptContext();
    return (
        <scrollbox focused width="100%" height="100%">
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
                            <text fg={theme.text}>
                                {message.content}
                            </text>
                        </box>
                    )}
                </box>
            ))}
        </scrollbox>
    );
}
