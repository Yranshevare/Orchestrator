import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import commands from "../SlashCommand/commands";
import { read } from "../util/read";
import { eventOptions, events } from "../util/event";
import { useKeyboard } from "@opentui/react";
import { write } from "../util/write";
import type { handler } from "../Types/slashCommand";
import type { SettingsState } from "../Types/settings";


type SettingsContextType = {
    settings: SettingsState;
    isReady: boolean;
    refreshSettings: () => Promise<void>;
    commands: { command: string; description: string; handler: (params: string[]) => Promise<handler> }[];
    filteredCommand: { command: string; description: string }[];
    filterSlashCommand: (command: string) => void;
    isModelOpen: boolean;
    setIsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
    saveModel: (model: string) => void;
};

// const settingList = ["/model", "/agents", "/agent add", "/agent update", "/agent delete", "/exit"];

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_SETTINGS: SettingsState = {
    model: { provider: "NA", name: "NA", api_key: "NA" },
    agents: {
        NA: { cmd: "NA", when: "NA" },
    },
};

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
    const [isReady, setIsReady] = useState(false);
    const [filteredCommand, setFilteredCommand] = useState<{ command: string; description: string }[]>([]);
    const [isModelOpen, setIsModelOpen] = useState(false);

    events.on(eventOptions.LLMModel, () => {
        setIsModelOpen(true);
    });

    useKeyboard((key) => {
        if (isModelOpen && key.name === "escape") setIsModelOpen(false);
    });

    // takes user input and return list of matching commands
    const filterSlashCommand = (command: string) => {
        if (!command.startsWith("/")) {
            setFilteredCommand([]);
            return;
        }
        const commandList = commands.reduce((acc: { command: string; description: string }[], option) => {
            if (option.command.toLowerCase().startsWith(command.toLowerCase())) {
                acc.push({
                    command: option.command,
                    description: option.description,
                });
            }
            return acc;
        }, []);
        setFilteredCommand(commandList);
    };

    const refreshSettings = async () => {
        const settingsData = await read();

        if (settingsData.success) {
            const parsedSettings = JSON.parse(settingsData.data as string) as SettingsState;
            // console.log("refreshSettings parsedSettings:", parsedSettings);
            const settingObj: SettingsState = {
                model: parsedSettings.model || DEFAULT_SETTINGS.model,
                agents: parsedSettings.agents || DEFAULT_SETTINGS.agents,
            };
            setSettings(settingObj);
            setIsReady(true);
        } else {
            setSettings(DEFAULT_SETTINGS);
            setIsReady(true);
        }
    };

    useEffect(() => {
        void refreshSettings();
    }, []);

    const saveModel = async (model: string) => {
        console.log(model);
        const updatedSettings = {
            ...settings,
            model: {
                ...settings.model,
                name: model,
            },
        };
        await write(JSON.stringify(updatedSettings, null, 2));
        setSettings(updatedSettings);
        setIsModelOpen(false);
    };

    const value = useMemo<SettingsContextType>(
        () => ({
            settings,
            isReady,
            refreshSettings,
            commands,
            filteredCommand,
            filterSlashCommand,
            isModelOpen,
            setIsModelOpen,
            saveModel,
        }),
        [settings, isReady, filteredCommand, isModelOpen]
    );

    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettingsContext() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error("useSettingsContext must be used inside SettingsProvider");
    }

    return context;
}
