import {useInput} from 'ink';
import React, {createContext, useContext, useMemo, useState} from 'react';
import {useAgentContext} from './AgentProvider.js';

type Message = {
	role: 'user' | 'assistant';
	content: string;
};

type AppContextType = {
	messages: Message[];
	draft: string;
};

const AppContext = createContext<AppContextType | null>(null);

// dummy function
function createDummyResponse(prompt: string) {
	const responses = [
		'That sounds like a solid task. I can help you tackle it step by step.',
		'Here is a practical approach to get you moving quickly.',
		'I will draft a simple plan and keep the implementation lightweight.',
		'This looks doable. I will suggest a focused solution for now.',
	];

	const randomReply = responses[Math.floor(Math.random() * responses.length)];
	const trimmedPrompt =
		prompt.length > 60 ? `${prompt.slice(0, 57)}...` : prompt;

	return `${randomReply} You asked: "${trimmedPrompt}"`;
}

export default function PromptContext({children}: {children: React.ReactNode}) {
	const [messages, setMessages] = useState<Message[]>([
		{
			role: 'assistant',
			content: 'Welcome to Orchestrator. Type your coding request below.',
		},
	]);
	const [draft, setDraft] = useState('');

	const {selectedAgent, agents} = useAgentContext();

	const handleSubmit = (prompt: string) => {
		const trimmedPrompt = prompt.trim();

		if (!trimmedPrompt) {
			return;
		}

		setMessages(previousMessages => [
			...previousMessages,
			{role: 'user', content: trimmedPrompt},
			{
				role: 'assistant',
				content: `${createDummyResponse(trimmedPrompt)}, agent: ${
					agents[selectedAgent]?.name
				}`,
			},
		]);
		setDraft('');
	};

	useInput((input, key) => {
		if (key.return) {
			handleSubmit(draft);
			return;
		}

		if (key.backspace || key.delete) {
			setDraft(draft.slice(0, -1));
			return;
		}

		if (key.escape) {
			setDraft('');
			return;
		}

		if (input && !key.ctrl && !key.meta) {
			setDraft(`${draft}${input}`);
		}
	});

	const value = useMemo<AppContextType>(
		() => ({
			messages,
			draft,
		}),
		[draft, messages],
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function usePromptContext() {
	const context = useContext(AppContext);

	if (!context) {
		throw new Error('useAppContext must be used inside AppProvider');
	}

	return context;
}
