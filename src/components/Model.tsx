import React, { useEffect, useRef, useState } from "react";
import { theme } from "../theme";
import { useKeyboard } from "@opentui/react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import type { TextareaRenderable } from "@opentui/core";

const modelList = ["model1", "model2", "model3"];

export default function Model() {
    const [selectedModel, setSelectedModel] = useState<number | null>(null);
    const [filteredModels, setFilteredModels] = useState<string[]>(modelList);
    const [input, setInput] = useState("");
    const [filterActive, setFilterActive] = useState(true);

    const { saveModel, settings } = useSettingsContext();

    const currentModel = settings.model.name;

    const ref = useRef<TextareaRenderable>(null);

    useEffect(() => {
        if (input.trim() === "") setFilteredModels(modelList);
        if (!filterActive) return;
        const newModelList = modelList.filter((model) => model.toLowerCase().includes(input.trim().toLowerCase()));
        if (selectedModel !== null && selectedModel >= newModelList.length) setSelectedModel(newModelList.length - 1);
        setFilteredModels(newModelList);
    }, [input, selectedModel, filterActive]);

    useKeyboard((key) => {
        switch (key.name) {
            case "up":
                setFilterActive(false);
                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : (prev - 1 + filteredModels.length) % filteredModels.length;

                    ref.current?.setText(filteredModels[next] || "");
                    ref.current?.gotoBufferEnd();

                    return next;
                });
                break;

            case "down":
                setFilterActive(false);
                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : (prev + 1) % filteredModels.length;

                    ref.current?.setText(filteredModels[next] || "");
                    ref.current?.gotoBufferEnd();

                    return next;
                });
                break;
            default:
                setFilterActive(true);
        }
    });

    function submitModel(input: string) {
        if (!filteredModels.includes(input)) {
            return;
        }
        saveModel(input);
        ref.current?.setText("");
    }
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
                        placeholder="search model name"
                        onSubmit={() => submitModel(ref.current?.plainText ?? "")}
                        keyBindings={[
                            {
                                name: "return",
                                ctrl: false,
                                action: "submit",
                            },
                        ]}
                        onContentChange={() => setInput(ref.current?.plainText ?? "")}
                        focused
                        width="100%"
                        height={1}
                    />
                </box>
                <text height={1} fg={theme.muted}>
                    esc
                </text>
            </box>
            <box width="100%">
                {filteredModels.map((model, index) => (
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
