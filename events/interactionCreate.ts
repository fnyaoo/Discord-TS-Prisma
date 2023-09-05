import { InteractionType, EmbedBuilder, Events } from "discord.js";

import BaseCommand from "../structures/BaseCommand";
import Client from "../structures/Client";
import BaseEvent from "../structures/BaseEvent";

function reverseEnum(enumObj: any, enumValue: string): string | undefined {
    const key = Object.keys(enumObj).find(key => enumObj[key] === enumValue);
    return key;
}

const event: BaseEvent = {
    name: Events.InteractionCreate,
    once: false,
    async execute(client: Client, interaction: any) {
        client.logger.send(`[INTERACTION] <user> interact with ${reverseEnum(InteractionType, interaction.type)}<customId>`, {user: interaction.user, customId: interaction?.customId})
        if (interaction.isChatInputCommand() || interaction.isContextMenuCommand() || interaction?.type == InteractionType.ApplicationCommandAutocomplete) {
            const cmd: BaseCommand | undefined = client.commands.get(interaction.commandName);
            if (cmd) {
                function _catch(e: Error) {
                    console.log(e);
                    let subCommand = '';
                    try { subCommand = (<any>interaction).options.getSubcommand(); } catch (error) {};
                    client.logger.error(`[EVENT/INTERACTIONCREATE] Ошибка выполнения команды ${subCommand==''? `${cmd?.name}`: `${cmd?.name} ${subCommand}`}: ${e}`);
                    const embed = new EmbedBuilder()                                
                        .setDescription(`Ошибка выполнения команды **${subCommand==''? `\`${cmd?.name}\``: `\`${cmd?.name} ${subCommand}\``}**\n\`\`\`\n${e}\`\`\``)
                        .setColor("DarkButNotBlack");
                        
                    interaction.reply({ embeds: [embed], ephemeral: true })
                        .catch((e: any ) => { interaction.followUp({ embeds: [embed], ephemeral: true }) })
                }

                if (interaction?.type == InteractionType.ApplicationCommandAutocomplete) {
                    cmd.autocomplete(client, interaction).catch(_catch);
                } else {
                    cmd.execute(client, interaction).then(()=>cmd.after(client, interaction)).catch(_catch);
                    
                }
            }
        } 
    }
}

export default event;