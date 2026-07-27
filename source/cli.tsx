#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import {AppProvider} from './provider/AppContext.js';

// Clear the terminal
process.stdout.write('\x1Bc');

const {waitUntilExit} = render(
	<AppProvider>
		<App />
	</AppProvider>,
);
await waitUntilExit();

console.log('App exited');
