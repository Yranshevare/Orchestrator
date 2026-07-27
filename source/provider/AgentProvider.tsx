import {useInput} from 'ink';
import React, {createContext, useContext, useMemo, useState} from 'react';

type Agent = {
	name: string;
	command: string;
};

const agents: Agent[] = [
	{name: 'GPT-5', command: 'gpt'},
	{name: 'Claude', command: 'claude'},
	{name: 'Gemini', command: 'gemini'},
];

type AppContextType = {
	selectedAgent: number;
	agents: Agent[];
};

const AppContext = createContext<AppContextType | null>(null);

export default function AgentProvider({children}: {children: React.ReactNode}) {
	const [selectedAgent, setSelectedAgent] = useState(0);

	const selectNextAgent = () => {
		setSelectedAgent(prev => (prev === agents.length - 1 ? 0 : prev + 1));
	};

	const selectPreviousAgent = () => {
		setSelectedAgent(prev => (prev === 0 ? agents.length - 1 : prev - 1));
	};

	useInput((_, key) => {
		if (key.leftArrow || key.upArrow) {
			selectPreviousAgent();
		}

		if (key.rightArrow || key.downArrow) {
			selectNextAgent();
		}
	});

	const value = useMemo<AppContextType>(
		() => ({
			selectedAgent,
			agents,
		}),
		[agents, selectedAgent],
	);
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}


export function useAgentContext() {
    const context = useContext(AppContext);

    if (!context) {
        throw new Error('useAppContext must be used inside AppProvider');
    }

    return context;
}