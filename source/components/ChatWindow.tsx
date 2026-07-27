import {Box, Text} from 'ink';
import React from 'react';
import {theme} from '../theme.js';
import { usePromptContext } from '../provider/PromptProvider.js';

export default function ChatWindow() {
	const {messages} = usePromptContext();

	return (
		<Box flexGrow={1}  borderColor={theme.border} padding={1} flexDirection="column">
			<Text color={theme.primary} bold>
				Session
			</Text>
			{messages.map((message, index) => (
				<Text
					key={`${message.role}-${index}`}
					color={message.role === 'user' ? theme.primary : theme.success}
					dimColor={message.role === 'assistant'}
				>
					{message.role === 'user' ? 'You' : 'Agent'}: {message.content}
				</Text>
			))}
		</Box>
	);
}