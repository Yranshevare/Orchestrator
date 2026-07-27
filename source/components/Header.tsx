import {Box, Text} from 'ink';
import React from 'react';
import {theme} from '../theme.js';

export default function Header() {
	return (
		<Box justifyContent="space-between" borderStyle="round" borderColor={theme.border} paddingX={1} paddingY={0}>
			<Text color={theme.primary} bold>
				Orchestrator
			</Text>

			<Text color={theme.secondary}>
				● AI Ready
			</Text>
		</Box>
	);
}