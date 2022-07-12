module.exports.run = async function(interaction, client) {
	if (!interaction.isCommand()) return;

	const command = client.slashCommands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.run(client, interaction);
	}
	catch (error) {
		return console.error(error);
	}
};

module.exports.help = {
	name: 'interactionCreate',
	once: false,
};