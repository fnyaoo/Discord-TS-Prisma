import { ActivityType } from "discord.js";
import Client from "../structures/Client";
import Config from "../structures/Config";
import { Events } from "discord.js";
import BaseEvent from "../structures/BaseEvent";
import { putSlashCommands } from "../utils/putSlashCommands";

const event: BaseEvent = {
	name: Events.InteractionCreate,
	once: false,
	async execute(client: Client) {
		client.logger.init(client);
		const isCommandsLoaded = await putSlashCommands();
		if (!isCommandsLoaded) return client.logger.error(`${isCommandsLoaded}`);

		client.logger.send(`[EVENT/READY] Logged as ${client.user.tag}`);
		client.logger.send(`[HANDLER/EVENTS] ${client.store.events.length} events have been uploaded.`);
		client.logger.send(`[HANDLER/COMMANDS] ${client.store.commands.size} commands have been uploaded.`);
		client.user.setActivity({ name: `🤡`, type: ActivityType.Competing });
	}
};

export default event;
