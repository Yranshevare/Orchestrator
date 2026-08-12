import React, { useEffect, useRef, useState } from "react";
import { theme } from "../theme";
import { useKeyboard, useRenderer } from "@opentui/react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import type { TextareaRenderable } from "@opentui/core";
import provider from "../util/provider";

export default function Model() {
    const [selectedModel, setSelectedModel] = useState<number | null>(null);
    const [modelList, setModelList] = useState<string[]>([]);
    const [filteredModels, setFilteredModels] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [filterActive, setFilterActive] = useState(true);

    const [pageStart, setPageStart] = useState(0);
    const [pageSize, setPageSize] = useState(1);

    const { saveModel, settings } = useSettingsContext();
    const modelProvider = settings.model.provider;
    const currentModel = settings.model.name;

    const renderer = useRenderer();

    const ref = useRef<TextareaRenderable>(null);

    /*
     * Your modal is 50% of the terminal height.
     *
     * We subtract:
     * - 2 rows for the border
     * - 2 rows for the input area
     *
     * The remaining rows are available for models.
     */
    useEffect(() => {
        const updatePageSize = () => {
            const terminalHeight = renderer.height;

            const modalHeight = Math.floor(terminalHeight * 0.5);

            const inputHeight = 2;
            const borderHeight = 2;

            const availableRows = modalHeight - inputHeight - borderHeight;

            setPageSize(Math.max(1, availableRows));
        };

        updatePageSize();

        renderer.on("resize", updatePageSize);
    }, [renderer]);

    const visibleModels = filteredModels.slice(pageStart, pageStart + pageSize);

    useEffect(() => {
        let cancelled = false;

        setModelList(["fetching the models..."]);

        async function loadModels() {
            if (modelProvider === "NA" || modelProvider === undefined || !(modelProvider in provider) || !provider[modelProvider]) {
                setModelList([]);
                return;
            }

            try {
                const models = await provider[modelProvider].listModel(settings.model.api_key);

                if (!cancelled) {
                    setModelList(models);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Failed to load models:", error);

                    setModelList(["failed to load models"]);
                }
            }
        }

        loadModels();

        return () => {
            cancelled = true;
        };
    }, [modelProvider]);

    useEffect(() => {
        if (!filterActive) {
            return;
        }

        const query = input.trim().toLowerCase();

        if (query === "") {
            setFilteredModels(modelList);
            setSelectedModel(null);
            setPageStart(0);
            return;
        }

        const newModelList = modelList.filter((model) => model.toLowerCase().includes(query));

        setFilteredModels(newModelList);
        setSelectedModel(null);
        setPageStart(0);
    }, [input, filterActive, modelList]);

    useKeyboard((key) => {
        if (filteredModels.length === 0) {
            return;
        }

        switch (key.name) {
            case "up":
                setFilterActive(false);

                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : prev - 1 < 0 ? filteredModels.length - 1 : prev - 1;

                    /*
                     * Move viewport up when selected model
                     * leaves the visible area.
                     */
                    if (next < pageStart) {
                        setPageStart(next);
                    }

                    /*
                     * Wrap to bottom.
                     */
                    if (next === filteredModels.length - 1) {
                        setPageStart(Math.max(0, filteredModels.length - pageSize));
                    }

                    ref.current?.setText(filteredModels[next] ?? "");
                    ref.current?.gotoBufferEnd();

                    return next;
                });

                break;

            case "down":
                setFilterActive(false);

                setSelectedModel((prev) => {
                    const next = prev === null ? 0 : (prev + 1) % filteredModels.length;

                    /*
                     * Move viewport down when selected model
                     * leaves the visible area.
                     */
                    if (next >= pageStart + pageSize) {
                        setPageStart(next - pageSize + 1);
                    }

                    /*
                     * Wrap to top.
                     */
                    if (next === 0) {
                        setPageStart(0);
                    }

                    ref.current?.setText(filteredModels[next] ?? "");
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
        setInput("");
        setSelectedModel(null);
        setPageStart(0);
    }

    /*
     * Scrollbar calculations
     */
    const maxPageStart = Math.max(0, filteredModels.length - pageSize);

    const scrollbarRows = pageSize;

    const thumbSize = filteredModels.length <= pageSize ? scrollbarRows : Math.max(1, Math.round((pageSize / filteredModels.length) * scrollbarRows));

    const thumbPosition = maxPageStart === 0 ? 0 : Math.round((pageStart / maxPageStart) * (scrollbarRows - thumbSize));

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
                height={2}
                minHeight={2}
                justifyContent="space-between"
                backgroundColor={theme.inputBackground}
                width="100%"
            >
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

            <box flexDirection="row" width="100%">
                {/* Models */}
                <box flexGrow={1} width="100%">
                    {visibleModels.map((model, index) => {
                        const actualIndex = pageStart + index;

                        return (
                            <box width="100%" key={model} backgroundColor={actualIndex === selectedModel ? theme.selection : theme.surface}>
                                <text marginLeft={1} fg={actualIndex === selectedModel ? theme.primary : theme.text}>
                                    • {model} {model === currentModel && " (current)"}
                                </text>
                            </box>
                        );
                    })}
                </box>

                {/* Scrollbar */}
                {filteredModels.length > pageSize && (
                    <box width={1} flexDirection="column">
                        {Array.from({
                            length: scrollbarRows,
                        }).map((_, index) => {
                            const isThumb = index >= thumbPosition && index < thumbPosition + thumbSize;

                            return (
                                <text key={index} fg={isThumb ? theme.inputText : theme.muted}>
                                    {isThumb ? "█" : "│"}
                                </text>
                            );
                        })}
                    </box>
                )}
            </box>
        </box>
    );
}
