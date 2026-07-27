import {Box, Text} from 'ink';
import React, {useEffect, useState} from 'react';
import {theme} from '../theme.js';
import { usePromptContext } from '../provider/PromptProvider.js';

export default function PromptInput() {
	const {draft} = usePromptContext();
	const [showCursor, setShowCursor] = useState(true);

	useEffect(() => {
		const interval = setInterval(() => {
			setShowCursor(prev => !prev);
		}, 500);

		return () => clearInterval(interval);
	}, []);

	

	return (
		<Box
			borderStyle="round"
			borderColor={theme.border}
			marginTop={1}
			paddingX={1}
			paddingY={0}
		>
			<Text color={theme.secondary}>▶</Text>
			<Text> </Text>
			<Text color={draft ? theme.text : theme.muted}>
				{draft ? (
					<>
						{draft}
						{showCursor ? '█' : ' '}
					</>
				) : (
					<>
						{showCursor ? '█' : ' '}
						{'Enter your prompt...'}
					</>
				)}
			</Text>
		</Box>
	);
}
