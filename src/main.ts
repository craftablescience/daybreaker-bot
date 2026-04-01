// noinspection JSIgnoredPromiseFromCall

import fs from 'fs';
import { ActivityType, Collection, IntentsBitField } from 'discord.js';
import { OracleTurretClient } from './types/client';
import { Command } from './types/interaction';
import { updateCommands } from './utils/update_commands';

import * as config from './config.json';

async function main() {
	// You need a token, duh
	if (!config.token) {
		return;
	}

	// Create client
	const client = new OracleTurretClient({
		intents: new IntentsBitField([
			IntentsBitField.Flags.Guilds,
			IntentsBitField.Flags.GuildMessages,
			IntentsBitField.Flags.MessageContent,
		]),
	});

	// Register commands
	client.commands = new Collection();
	for (const file of fs.readdirSync('./build/commands/global').filter(file => file.endsWith('.js'))) {
		const command: Command = (await import(`./commands/global/${file}`)).default;
		client.commands.set(command.data.name, command);
	}

	// Run this when the client is ready
	client.on('clientReady', async () => {
		if (!client.user) {
			return;
		}

		const statusSetter = () => {
			client.user?.setActivity(`WATCHING OVER ALL`, { type: ActivityType.Custom });
		};
		statusSetter();
		setInterval(statusSetter, 120e3);
	});

	// Listen for messages
	client.on('messageCreate', async message => {
		if (message.author.bot) return;

		const text = message.content.toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
		const censor = async (msg: string) => {
			await message.reply({ content: `${msg}\n-# ORIGINAL MESSAGE: ||${text}||` });
			await message.delete();
			await message.member?.timeout(2000, "CENSORED");
		};
		if (text.includes('brony')) {
			await censor('USE APPROVED FANDOM-CENTRIC LANGUAGE: \`MLP FAN\`');
		} else if (text.includes('everyone') || text.includes('every0ne') || text.includes('everybody') || text.includes('everyb0dy') || text.includes('everybrony') || text.includes('everybr0ny')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`EVERYPONY\`');
		} else if (text.includes('woman') || text.includes('w0man')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`MARE\`');
		} else if (text.includes('women') || text.includes('w0men')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`MARES\`');
		} else if (text.includes('man')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`STALLION\`');
		} else if (text.includes(' men')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`STALLIONS\`');
		} else if (text.includes('people') || text.includes('humans')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`PONIES\`');
		} else if (text.includes('person') || text.includes('human')) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`PONY\`');
		} else if (text.includes("changeling") || text.includes("dog") || text.includes("griffon") || text.includes("griffin") || text.includes("gryphon") || text.includes("griff")) {
			await censor('SUBVERSIVE MESSAGE CONTENT DETECTED.');
		} else if (text.includes("nightmare") || text.includes("moon") || text.includes("luna") || text.includes("celestia")) {
			await censor('SUBVERSIVE MESSAGE CONTENT DETECTED. OUR LEADER IS PRETTIER.');
		} else if (text.includes('equestria')) {
			await censor('SUBVERSIVE MESSAGE CONTENT DETECTED.');
		} else if (text.includes("fuck") && (text.includes("pony", text.indexOf("fuck")) || text.includes("ponie", text.indexOf("fuck")))) {
			await censor('SUBVERSIVE MESSAGE CONTENT DETECTED.');
		} else if (text.includes("main")) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`MANE\`');
		} else if (text.includes("hand") || text.includes("foot") || text.includes('feet') || text.includes("paw")) {
			await censor('USE APPROVED PONY-CENTRIC LANGUAGE: \`HOOF\`');
		}
	});

	// Listen for commands
	client.on('interactionCreate', async interaction => {
		if (interaction.isChatInputCommand() || interaction.isContextMenuCommand()) {
			const command = client.commands?.get(interaction.commandName);
			if (!command) return;

			try {
				await command.execute(interaction);
			} catch (err) {
				if (interaction.deferred) {
					await interaction.followUp(`THERE WAS AN ERROR WHILE EXECUTING THIS COMMAND: ${err}`);
				} else {
					await interaction.reply(`THERE WAS AN ERROR WHILE EXECUTING THIS COMMAND: ${err}`);
				}
				return;
			}
		}
	});

	// Log in
	await client.login(config.token);

	async function shutdown() {
		await client.destroy();
		process.exit();
	}

	process.on('SIGINT', shutdown);
}

if (process.argv.includes('--update-commands')) {
	updateCommands();
} else {
	main();
}
