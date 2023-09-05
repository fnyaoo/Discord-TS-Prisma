process.stdout.write('\u001b[2J\u001b[0;0H');

import Client from "./structures/Client";
import { GatewayIntentBits, Partials } from "discord.js";
import 'dotenv/config';
import ready from "./utils/ready";

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
(async()=>{
	client.logger.send(`[INDEX] Инициализация бота`);
	await client.login(process.env.TOKEN)
	await client.logger.init(client);
	
	(await import(`./handlers/events`)).default(client).catch(client.logger.error);
	(await import(`./handlers/commands`)).default(client).catch(client.logger.error);
	client.on('error', client.logger.error)
	client.on('warn', client.logger.send)
	
	process.on('uncaughtException', client.logger.error);
	process.on('unhandledRejection', client.logger.error);
})()
client.on('ready', ()=> ready(client))