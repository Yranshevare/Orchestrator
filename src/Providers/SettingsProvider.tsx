import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import commands from "../SlashCommand/commands";
import type { handler } from "../SlashCommand/Type";
import { read } from "../util/read";
import { keys } from "../constant";
import { eventOptions, events } from "../util/event";
import { useKeyboard } from "@opentui/react";
import { write } from "../util/write";

type Agent = {
    cmd: string;
    when: string;
};

export type Agents = Record<string, Agent>;

type model = {
    provider: string;
    name: string;
    api_key: string;
};

export type SettingsState = {
    model: model;
    agents: Agents;
};

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
        const parsedSettings = JSON.parse(settingsData.data as string) as SettingsState;
        console.log("refreshSettings parsedSettings:", parsedSettings);
        const settingObj: SettingsState = {
            model: parsedSettings.model || DEFAULT_SETTINGS.model,
            agents: parsedSettings.agents || DEFAULT_SETTINGS.agents,
        };
        setSettings(settingObj);
        setIsReady(true);
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
