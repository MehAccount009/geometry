require('dotenv').config();
const { readdirSync } = require('fs');
const { join } = require('path');
const { Client, Collection } = require('discord.js');

const token = process.env['token'];

const client = new Client({ intents: 32767 });
client.slashCommands = new Collection();
client.events = new Collection();

const commandFolders = readdirSync(join(__dirname, 'commands'));
const commandFiles = readdirSync(join(__dirname, 'commands', `${commandFolders}`));
module.exports = { commandFolders, commandFiles };

(function() {
	const eventFiles = readdirSync(join(__dirname, 'events')).filter(f => f.endsWith('.js'));
	for (const file of eventFiles) {
		const event = require(`./events/${file}`);

		if (event.once) {
			client.once(event.help.name, (...args) => event.run(...args, client));
		}
		else {
			client.on(event.help.name, (...args) => event.run(...args, client));
		}
		client.events.set(event.help.name, event);
	}
} ());

client.login(token);