// noinspection JSUnusedGlobalSymbols

import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Command } from '../../types/interaction';

const Info: Command = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('RESPONDS WITH INFORMATIONS.'),

	async execute(interaction: CommandInteraction) {
		const username = interaction.client.user.displayName;

		const embed = new EmbedBuilder()
			.setAuthor({
				name: username,
				url: 'https://github.com/craftablescience/daybreaker-bot',
				iconURL: interaction.client.user?.displayAvatarURL(),
			})
			.setDescription('INFORMATIONS ABOUT YOUR POWERFUL LEADER.')
			.setColor('Gold')
			.addFields(
				{ name: 'SUPPORTERS', value: '100%', inline: true },
				{ name: 'DISSIDENTS', value: '0%', inline: true },
				{ name: '███ ██████', value: 'NOT RELEVANT RIGHT NOW', inline: true },
				{ name: 'POWER LEVEL', value: 'OVER 9000', inline: true })
			.setTimestamp();

		return interaction.reply({ embeds: [embed] });
	}
};
export default Info;
