import { AutocompleteInteraction, CommandInteraction, InteractionResponse, Message, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandsOnlyBuilder } from 'discord.js';

export interface CommandBase {
	data: unknown,
	execute(interaction: CommandInteraction): Promise<void | InteractionResponse | Message>,
	getAutocompleteOptions?(interaction: AutocompleteInteraction): { name: string, value: string }[],
}

export interface Command extends CommandBase {
	data: SlashCommandBuilder | SlashCommandOptionsOnlyBuilder | SlashCommandSubcommandsOnlyBuilder,
}
