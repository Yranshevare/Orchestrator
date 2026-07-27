import React from 'react';
import {Box} from 'ink';
import Header from './components/Header.js';
import PromptInput from './components/PromptInput.js';
import Footer from './components/Footer.js';
import ChatWindow from './components/ChatWindow.js';
import {AppProvider} from './provider/AppContext.js';

export default function App() {
	return (
		<AppProvider>
			<Box flexDirection="column" height="100%">
				<Header />
				<ChatWindow />
				<PromptInput />
				<Footer />
			</Box>
		</AppProvider>
	);
}
