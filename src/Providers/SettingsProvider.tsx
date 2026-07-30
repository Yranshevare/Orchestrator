
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import exit from "../SlashCommand/exit";

export type Agent = {
    name: string;
    command: string;
};

export type SettingsState = {
    model: string;
    agents: Agent[];
};

type SettingsContextType = {
    settings: SettingsState;
    isReady: boolean;
    setModel: (model: string) => Promise<void>;
    addAgent: (name: string, command: string) => Promise<void>;
    updateAgent: (existingName: string, newName: string, newCommand: string) => Promise<void>;
    deleteAgent: (name: string) => Promise<void>;
    setAgentActive: (isActive: boolean) => Promise<void>;
    refreshSettings: () => Promise<void>;
    settingList: string[];
    filteredCommand: string[];
    handleSlashCommand: (command: string) => void;
   exit: () => void 
};

const settingList = ["/model", "/agents", "/agent add", "/agent update", "/agent delete", "/exit"];

const SettingsContext = createContext<SettingsContextType | null>(null);

const DEFAULT_SETTINGS: SettingsState = {
    model: "",
    agents: [{name:"abc", command:"abc"}, {name:"efg", command:"efg"}],
};

const settingsPath = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "settings.json");

async function readSettingsFromDisk(): Promise<SettingsState> {
    try {
        const content = await readFile(settingsPath, "utf8");
        const parsed = JSON.parse(content) as Partial<SettingsState>;

        return {
            model: typeof parsed.model === "string" ? parsed.model : DEFAULT_SETTINGS.model,
            agents: Array.isArray(parsed.agents)
                ? parsed.agents.filter((agent): agent is Agent => Boolean(agent && typeof agent.name === "string" && typeof agent.command === "string"))
                : DEFAULT_SETTINGS.agents,
        };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

async function writeSettingsToDisk(settings: SettingsState) {
    await mkdir(dirname(settingsPath), { recursive: true });
    await writeFile(settingsPath, JSON.stringify(settings, null, 2));
}

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
    const [isReady, setIsReady] = useState(false);
    const [filteredCommand, setFilteredCommand] = useState<string[]>([]);

    // takes user input and return list of matching commands
    const handleSlashCommand = (command: string) => {
        if (!command.startsWith("/")) {
            setFilteredCommand([]);
            return;
        }
        const commandList = settingList.filter((option) => option.toLowerCase().startsWith(command.toLowerCase()));
        setFilteredCommand(commandList);
    };

    const refreshSettings = async () => {
        const nextSettings = await readSettingsFromDisk();
        setSettings(nextSettings);
        setIsReady(true);
    };

    

    useEffect(() => {
        void refreshSettings();
    }, []);

    const saveSettings = async (nextSettings: SettingsState) => {
        await writeSettingsToDisk(nextSettings);
        setSettings(nextSettings);
    };

    const setModel = async (model: string) => {
        const nextSettings = {
            ...settings,
            model: model.trim() || settings.model,
        };

        await saveSettings(nextSettings);
    };

    const addAgent = async (name: string, command: string) => {
        const cleanName = name.trim();
        const cleanCommand = command.trim();

        if (!cleanName || !cleanCommand) return;

        const nextSettings = {
            ...settings,
            agents: [...settings.agents, { name: cleanName, command: cleanCommand }],
        };

        await saveSettings(nextSettings);
    };

    const updateAgent = async (existingName: string, newName: string, newCommand: string) => {
        const normalizedExistingName = existingName.trim();
        const normalizedNewName = newName.trim() || normalizedExistingName;
        const normalizedNewCommand = newCommand.trim();

        if (!normalizedExistingName || !normalizedNewCommand) return;

        const nextSettings = {
            ...settings,
            agents: settings.agents.map((agent) =>
                agent.name.toLowerCase() === normalizedExistingName.toLowerCase()
                    ? { name: normalizedNewName, command: normalizedNewCommand }
                    : agent
            ),
        };

        await saveSettings(nextSettings);
    };

    const deleteAgent = async (name: string) => {
        const cleanName = name.trim();

        if (!cleanName) return;

        const nextSettings = {
            ...settings,
            agents: settings.agents.filter((agent) => agent.name.toLowerCase() !== cleanName.toLowerCase()),
        };

        await saveSettings(nextSettings);
    };

    const setAgentActive = async (isActive: boolean) => {
        await saveSettings({
            ...settings,
        });
    };

    const value = useMemo<SettingsContextType>(
        () => ({
            settings,
            isReady,
            setModel,
            addAgent,
            updateAgent,
            deleteAgent,
            setAgentActive,
            refreshSettings,
            settingList,
            filteredCommand, 
            handleSlashCommand,
            exit
        }),
        [settings, isReady, filteredCommand]
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
