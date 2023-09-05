import { ActivityType } from "discord.js";
import Client from "../structures/Client";
import Config from "../structures/Config";


export default async (client: Client) => {  
    client.logger.send(`[EVENT/READY] Logged as ${client.user.tag}`);
    const guild = await client.guilds.fetch(Config.guildId);
    client.user.setActivity({ name: `🤡`, type:  ActivityType.Competing});
};