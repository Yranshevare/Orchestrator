import { TextareaRenderable, TextAttributes } from "@opentui/core";
import { theme } from "../theme";
import { usePromptContext } from "../Providers/PromptProvider";
import { useRef, useState } from "react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import { useKeyboard } from "@opentui/react";
import { AnimatedIcon } from "./AnimatedIcon";

export default function Input() {
    const { handleSubmit, status } = usePromptContext();
    const { filterSlashCommand, filteredCommand } = useSettingsContext();
    const [commandIndex, setCommandIndex] = useState<number>(0);

    const ref = useRef<TextareaRenderable>(null);

    useKeyboard((key) => {
        if (filteredCommand.length > 0) {
            switch (key.name) {
                case "up":
                    setCommandIndex((prev) => (prev === null ? 0 : (prev - 1 + filteredCommand.length) % filteredCommand.length));
                    break;
                case "down":
                    setCommandIndex((prev) => (prev === null ? 0 : (prev + 1) % filteredCommand.length));
                    break;
                case "tab":
                    commandIndex !== null && ref.current?.setText(filteredCommand[commandIndex]?.command || "");
                    ref.current?.gotoBufferEnd();
                    break;
            }
        }
    });

    return (
        <>
            {filteredCommand.length > 0 && (
                <box position="absolute" bottom={3} width="100%">
                    {filteredCommand.map((command, index) => (
                        <box
                            key={command.command}
                            flexDirection="row"
                            paddingLeft={1}
                            justifyContent="flex-start"
                            gap={5}
                            alignItems="center"
                            backgroundColor={commandIndex === index ? theme.surface : theme.inputBackground}
                            width="100%"
                        >
                            <text fg={theme.primary}>{command.command}</text>
                            {commandIndex === index && <text fg={theme.muted}>{command.description}</text>}
                        </box>
                    ))}
                </box>
            )}
            {status && (
                <>
                    <box marginLeft={1} flexDirection="row" gap={1}>
                        <AnimatedIcon frames={["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]} color={theme.muted}/>
                        <text fg={theme.muted}>{status}</text>
                    </box>
                    <box height={1}></box>
                </>
            )}

            <box
                flexDirection="row"
                paddingX={1}
                paddingY={1}
                justifyContent="space-between"
                alignItems="center"
                backgroundColor={theme.inputBackground}
                width="100%"
            >
                <box flexGrow={1} flexDirection="row" gap={1}>
                    <text fg={theme.primary} marginRight={1}>
                        ▶
                    </text>

                    <textarea
                        ref={ref}
                        onSubmit={() => {
                            handleSubmit(ref.current?.plainText ?? "");
                            ref.current?.setText("");
                        }}
                        keyBindings={[
                            {
                                name: "return",
                                ctrl: false,
                                action: "submit",
                            },
                        ]}
                        onContentChange={() => {
                            filterSlashCommand(ref.current?.plainText ?? "");
                        }}
                        placeholder="Enter prompt or use /model /agent"
                        focused
                        width="100%"
                        height={1}
                    />
                </box>

                <text fg={theme.primary} attributes={TextAttributes.BOLD} marginLeft={1}>
                    ⏎
                </text>
            </box>
        </>
    );
}
