import { TextareaRenderable, TextAttributes } from "@opentui/core";
import { theme } from "../theme";
import { usePromptContext } from "../Providers/PromptProvider";
import { useRef } from "react";

export default function Input() {
    const { handleSubmit } = usePromptContext();

    const ref = useRef<TextareaRenderable>(null);

    return (
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
                <text fg={theme.primary} marginRight={1}>▶</text>

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
                    placeholder="Enter your prompt..."
                    focused
                    width="100%"
                    height={1}
                />
            </box>

            <text fg={theme.primary} attributes={TextAttributes.BOLD} marginLeft={1}>
                ⏎
            </text>
        </box>
    );
}
