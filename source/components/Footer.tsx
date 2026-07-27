import {Box, Text} from 'ink';
import React from 'react';
import {theme} from '../theme.js';
import { useAgentContext } from '../provider/AgentProvider.js';

export default function Footer() {
	const {agents, selectedAgent} = useAgentContext();

	return (
		<Box justifyContent="space-between" marginTop={1}>
			<Text color={theme.muted}>
				↑↓ Agent:{' '}
				<Text color={theme.primary}>{agents[selectedAgent]?.name}</Text>
			</Text>

			<Text color={theme.primary}>⏎ Send</Text>

			<Text color={theme.muted}>Ctrl+C Exit</Text>
		</Box>
	);
}
