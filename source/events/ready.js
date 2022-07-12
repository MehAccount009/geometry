const { Routes } = require('discord-api-types/v10');
const { REST } = require('@discordjs/rest');
const { table } = require('table');
const { magenta, bgGreen, bgRed } = require('colors');

const { commandFolders, commandFiles } = require('../main');

const commands = [];
const clientId = process.env['id'];
const token = process.env['token'];

const rest = new REST({ version: '10' }).setToken(token);

module.exports.run = async function(client) {
	const config = {
		border: {
			topBody: '─',
			topJoin: '┬',
			topLeft: '┌',
			topRight: '┐',

			bottomBody: '─',
			bottomJoin: '┴',
			bottomLeft: '└',
			bottomRight: '┘',

			bodyLeft: '│',
			bodyRight: '│',
			bodyJoin: '│',

			joinBody: '─',
			joinLeft: '├',
			joinRight: '┤',
			joinJoin: '┼',
		},
		columns: [
			{ alignment: 'left', width: 35 },
			{ alignment: 'left', width: 35 },
			{ alignment: 'left', width: 35 },
		],
		spanningCells: [
			{ col: 0, row: 0, colSpan: 1, alignment: 'center' },
			{ col: 1, row: 0, colSpan: 1, alignment: 'center' },
			{ col: 2, row: 0, colSpan: 1, alignment: 'center' },
		],
		header: {
			alignment: 'center',
			content: magenta('Registro de inicio de sesión'),
		},
	};

	for (const folder of commandFolders) {
		for (const file of commandFiles) {
			const slash = require(`../commands/${folder}/${file}`);
			commands.push(slash.data.toJSON());
			client.slashCommands.set(slash.data.name, slash);
		}
	}

	const clientData = `Nombre: ${client.user.username}#${client.user.discriminator}\nIdentificación: ${client.user.id}\nPing: ${Math.round(client.ws.ping)}ms`;
	const date_time = `Fecha: ${new Date().toLocaleDateString()}\nHora: ${new Date().toLocaleTimeString()}`;
	const data = [
		['Cliente', 'Fecha de la sesión', 'Estado de la sesión'],
		[clientData, date_time, `${bgGreen('Conectado')}`],
	];
	const errorData = [
		['Cliente', 'Fecha de la sesión', 'Estado de la sesión'],
		[clientData, date_time, `${bgRed('Desconectado')}`],
	];

	try {
		console.log(table(data, config));

		await rest.put(
			Routes.applicationCommands(clientId), {
				body: commands,
			},
		);
	}
	catch (error) {
		return console.error(table(errorData, config), error);
	}
};

module.exports.help = {
	name: 'ready',
	once: false,
};