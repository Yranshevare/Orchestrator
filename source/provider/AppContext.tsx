import React from 'react';
import AgentProvider from './AgentProvider.js';
import PromptContext from './PromptProvider.js';

export function AppProvider({children}: {children: React.ReactNode}) {
	return (
		<AgentProvider>
			<PromptContext>{children}</PromptContext>
		</AgentProvider>
	);
}
