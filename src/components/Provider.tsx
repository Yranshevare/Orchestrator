import React, { useEffect, useRef, useState } from "react";
import { theme } from "../theme";
import { useKeyboard } from "@opentui/react";
import { useSettingsContext } from "../Providers/SettingsProvider";
import type { TextareaRenderable } from "@opentui/core";
import provider from "../util/provider";

const providerList: string[] = Object.keys(provider);

export default function Provider() {
    const [chosenProvider, setChosenProvider] = useState<string | null>(null);
    const [apiKey, setApiKey] = useState<string | null>(null);

    const { saveProvider } = useSettingsContext();

    function submit() {
        // console.log("submit api key", apiKey, chosenProvider);
        if (!chosenProvider || !apiKey) return;
        saveProvider(chosenProvider!, apiKey!);
    }

    return (
        <box flexShrink={0} width="50%" position="absolute" top="25%" left="25%" backgroundColor={theme.surface} borderColor={theme.border}>
            {chosenProvider ? <ApiKey setApiKey={setApiKey} submit={submit} /> : <ChooseProvider setChosenProvider={setChosenProvider} />}
        </box>
    );
}

function ChooseProvider({ setChosenProvider }: { setChosenProvider: React.Dispatch<React.SetStateAction<string | null>> }) {
    const [selectedProvider, setSelectedProvider] = useState<number | null>(null);
    const [filteredProviders, setFilteredProviders] = useState<string[]>(providerList);
    const [input, setInput] = useState("");
    const [filterActive, setFilterActive] = useState(true);

    const { settings } = useSettingsContext();

    const currentProvider = settings.model.name;

    const ref = useRef<TextareaRenderable>(null);

    useEffect(() => {
        if (input.trim() === "") setFilteredProviders(providerList);
        if (!filterActive) return;

        const newProviderList = providerList.filter((provider) => provider.toLowerCase().includes(input.trim().toLowerCase()));

        if (selectedProvider !== null && selectedProvider >= newProviderList.length) {
            setSelectedProvider(newProviderList.length - 1);
        }

        setFilteredProviders(newProviderList);
    }, [input, filterActive, selectedProvider]);

    useKeyboard((key) => {
        switch (key.name) {
            case "up":
                setFilterActive(false);
                setSelectedProvider((prev) => {
                    const next = prev === null ? 0 : (prev - 1 + filteredProviders.length) % filteredProviders.length;

                    ref.current?.setText(filteredProviders[next] || "");
                    ref.current?.gotoBufferEnd();

                    return next;
                });
                break;

            case "down":
                setFilterActive(false);
                setSelectedProvider((prev) => {
                    const next = prev === null ? 0 : (prev + 1) % filteredProviders.length;

                    ref.current?.setText(filteredProviders[next] || "");
                    ref.current?.gotoBufferEnd();

                    return next;
                });
                break;

            default:
                setFilterActive(true);
        }
    });

    function submitProvider(input: string) {
        if (!filteredProviders.includes(input)) {
            return;
        }
        return setChosenProvider(input);
    }

    return (
        <box height="100%">
            <box flexDirection="row" paddingX={1} paddingY={1} justifyContent="space-between" backgroundColor={theme.inputBackground} width="100%">
                <box flexDirection="row" gap={1}>
                    <text fg={theme.primary} marginRight={1}>
                        ▶
                    </text>

                    <textarea
                        ref={ref}
                        placeholder="search provider name"
                        onSubmit={() => submitProvider(ref.current?.plainText ?? "")}
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
                {filteredProviders.map((provider, index) => (
                    <box width="100%" key={index} backgroundColor={index === selectedProvider ? theme.selection : theme.surface}>
                        <text marginLeft={1} fg={index === selectedProvider ? theme.primary : theme.text}>
                            • {provider} {provider === currentProvider && "(current)"}
                        </text>
                    </box>
                ))}
            </box>
        </box>
    );
}

function ApiKey({ setApiKey, submit }: { setApiKey: React.Dispatch<React.SetStateAction<string | null>>; submit: () => void }) {
    const ref = useRef<TextareaRenderable>(null);

    return (
        <box flexDirection="column" gap={1}>
            <text>submit api key</text>
            <box flexDirection="row" paddingX={1} paddingY={1} justifyContent="space-between" backgroundColor={theme.inputBackground} width="100%">
                <box flexDirection="row" gap={1}>
                    <text fg={theme.primary} marginRight={1}>
                        ▶
                    </text>

                    <textarea
                        ref={ref}
                        placeholder="api key"
                        onSubmit={submit}
                        keyBindings={[
                            {
                                name: "return",
                                ctrl: false,
                                action: "submit",
                            },
                        ]}
                        onContentChange={() => setApiKey(ref.current?.plainText ?? "")}
                        focused
                        width="100%"
                        height={1}
                    />
                </box>
            </box>

            <box flexDirection="row" justifyContent="space-between">
                <text fg={theme.muted}>Enter to submit</text>
                <text height={1} fg={theme.muted}>
                    esc
                </text>
            </box>
        </box>
    );
}
