import React, { useRef, useState } from "react";
import { theme } from "../theme";
import { useKeyboard } from "@opentui/react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import type { TextareaRenderable } from "@opentui/core";

const modelList = ["model1", "model2", "model3"];

export default function Model() {
    const [selectedModel, setSelectedModel] = useState<number | null>(null);
    const { saveModel, settings } = useSettingsContext();

    const currentModel = settings.model.name;

    const ref = useRef<TextareaRenderable>(null);

    useKeyboard((key) => {
        switch (key.name) {
            case "up":
                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : (prev - 1 + modelList.length) % modelList.length;

                    ref.current?.setText(modelList[next] || "");

                    return next;
                });
                break;

            case "down":
                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : (prev + 1) % modelList.length;

                    ref.current?.setText(modelList[next] || "");

                    return next;
                });
                break;
        }
    });
    return (
        <box
            flexShrink={0}
            height="50%"
            width="50%"
            position="absolute"
            top="25%"
            left="25%"
            backgroundColor={theme.surface}
            borderColor={theme.border}
        >
            
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
                        placeholder="search model name"
                        onSubmit={() => {
                            saveModel(ref.current?.plainText ?? "");
                            ref.current?.setText("");
                        }}
                        keyBindings={[
                            {
                                name: "return",
                                ctrl: false,
                                action: "submit",
                            },
                        ]}
                        focused
                        width="100%"
                        height={1}
                    />
                </box>
            </box>
            <box width="100%">
                {modelList.map((model, index) => (
                    <box width="100%" key={index} backgroundColor={index === selectedModel ? theme.selection : theme.surface}>
                        <text marginLeft={1} fg={index === selectedModel ? theme.primary : theme.text}>
                            • {model} {model === currentModel && "(current)"}
                        </text>
                    </box>
                ))}
            </box>
        </box>
    );
}
