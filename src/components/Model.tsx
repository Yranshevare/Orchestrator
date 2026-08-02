import React, { useMemo, useRef, useState } from "react";
import { theme } from "../theme";
import { useKeyboard } from "@opentui/react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import type { TextareaRenderable } from "@opentui/core";

const modelList = ["model1", "model2", "model3"];

export default function Model() {
    const { saveModel, settings } = useSettingsContext();
    const currentModel = settings.model.name;

    const ref = useRef<TextareaRenderable>(null);

    const [query, setQuery] = useState("");
    const [selectedModel, setSelectedModel] = useState<number | null>(null);

    const filteredModels = useMemo(() => {
        return modelList.filter((model) => model.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    useKeyboard((key) => {
        switch (key.name) {
            case "up":
                if (filteredModels.length === 0) return;

                setSelectedModel((prev) => (prev === null ? filteredModels.length - 1 : (prev - 1 + filteredModels.length) % filteredModels.length));
                break;

            case "down":
                if (filteredModels.length === 0) return;

                setSelectedModel((prev) => (prev === null ? 0 : (prev + 1) % filteredModels.length));
                break;

            default:
                // User typed something.
                // Wait until the textarea updates.
                queueMicrotask(() => {
                    const value = ref.current?.plainText ?? "";

                    setQuery(value);
                    setSelectedModel(null);
                });
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
            <box flexDirection="row" paddingX={1} paddingY={1} justifyContent="space-between" backgroundColor={theme.inputBackground} width="100%">
                <box flexDirection="row" gap={1}>
                    <text fg={theme.primary} marginRight={1}>
                        ▶
                    </text>

                    <textarea
                        ref={ref}
                        focused
                        placeholder="search model name"
                        width="100%"
                        height={1}
                        keyBindings={[
                            {
                                name: "return",
                                ctrl: false,
                                action: "submit",
                            },
                        ]}
                        onSubmit={() => {
                            const model = selectedModel !== null ? filteredModels[selectedModel] : (ref.current?.plainText ?? "");

                            if (model) {
                                saveModel(model);
                            }

                            ref.current?.setText("");
                            setQuery("");
                            setSelectedModel(null);
                        }}
                    />
                </box>

                <text height={1} fg={theme.muted}>
                    esc
                </text>
            </box>

            <box width="100%">
                {filteredModels.map((model, index) => (
                    <box key={model} width="100%" backgroundColor={index === selectedModel ? theme.selection : theme.surface}>
                        <text marginLeft={1} fg={index === selectedModel ? theme.primary : theme.text}>
                            • {model} {model === currentModel && "(current)"}
                        </text>
                    </box>
                ))}
            </box>
        </box>
    );
}
