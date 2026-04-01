import { Client, IntentsBitField } from 'discord.js';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

import * as config from '../config.json';

export async function updateCommands() {
	// You need a token, duh
	if (!config.token) {
		return;
	}

	const client = new Client({
		intents: [
			IntentsBitField.Flags.Guilds,
		],
	});
	await client.login(config.token);

	const globalCommands = [];
	for (const file of fs.readdirSync('./build/commands/global').filter(file => file.endsWith('.js'))) {
		globalCommands.push((await import(`../commands/global/${file}`)).default);
	}

	// Update global commands
	const rest = new REST().setToken(config.token);
	await rest.put(Routes.applicationCommands(config.client_id), { body: globalCommands.map(cmd => cmd.data.toJSON()) });

	await client.destroy();
}
