import Client from "./structures/Client";
import { GatewayIntentBits, Partials, REST, Routes } from "discord.js";
import "dotenv/config";
import { readdirSync } from "fs";
import path from "path";
import BaseCommand from "./structures/BaseCommand";
import Config from "./structures/Config";

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildPresences,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMembers
	],
	partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

export default client;

readdirSync(path.join(__dirname, "events")).forEach(async (file) => {
	try {
		const { default: event } = await import(`./events/${file}`);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(client, ...args));
		} else {
			client.on(event.name, (...args) => event.execute(client, ...args));
		}
		client.store.events.push(file);
	} catch (error) {
		console.log(file);
		console.log(error);
	}
});

readdirSync(path.join(__dirname, "commands")).forEach(async (dir) => {
	const files = readdirSync(path.join(__dirname, "commands", dir));
	files.map(async (file) => {
		try {
			const command: BaseCommand = new ((await import(path.join(__dirname, "commands", dir, file)))?.default)();
			command.componentListener(client);
			if (command.type.some((e) => Object.values(Config.CommandType).includes(e))) client.store.commands.set(command.name, command);
		} catch (error: any) {
			console.log(dir);
			client.logger.error(error);
		}
	});
});

client.login(process.env.TOKEN);