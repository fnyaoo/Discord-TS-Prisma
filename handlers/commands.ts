import { ApplicationCommandDataResolvable, REST, Routes } from 'discord.js';
import { lstat, readdir } from 'fs/promises';
import { join } from 'path';
import Client from "../structures/Client";
import BaseCommand from "../structures/BaseCommand";
import Config from "../structures/Config";

export default async function init(client: Client) {
    const slashes: ApplicationCommandDataResolvable[] | void = await walk(client, join(__dirname, '../commands/')).catch(client.logger.error);
    if (!Array.isArray(slashes)) return;

    const rest = new REST().setToken(process.env.TOKEN as string);
    await rest.put(Routes.applicationCommands(Config.clientId), { body: slashes }).then(()=>{
        client.logger.send(`[HANDLER/COMMANDS] Установлено ${slashes.length} комманд.`);
    }).catch((e)=>{
        client.logger.error(e);
    })

}

async function walk(client: Client, dir: string, slashes: ApplicationCommandDataResolvable[] = []): Promise<ApplicationCommandDataResolvable[]> {
    if (Array.isArray(dir)) return slashes;
    if (!(await lstat(dir)).isDirectory()) {
        try {
            const command: BaseCommand = new ((await import(`${dir}`))?.default);
            client.commands.set(command.name, command);
            command.componentListener(client);
            if (command.type.some((e)=>Object.values(Config.CommandType).includes(e))) slashes.push(command.slash);
        } catch (error: any) {
            console.log(dir);
            client.logger.error(error)
        }
        return slashes;
    }
    for(let file of (await readdir(dir))) {
        await walk(client, join(dir, file), slashes);
    }
    return slashes;
}