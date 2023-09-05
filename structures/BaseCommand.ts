import { ApplicationCommandType, BaseInteraction, AutocompleteInteraction, ApplicationCommandData, InteractionResponse, CommandInteraction, Message } from "discord.js";
import Client from "./Client";

export default class BaseCommand  {
    name: string = "commandname";
    usage: string = "Описание функционала команды";
    type: string[] = [];
    slash: ApplicationCommandData = { 
        name: this.name, 
        description: this.usage, 
        type: ApplicationCommandType.ChatInput, 
        options: []
    };
    componentsNames: string[] = [];

    constructor() {}
    async execute(client: Client, interaction: BaseInteraction): Promise<InteractionResponse<boolean> | undefined | Message> {
        return;
    }

    async componentListener(client: Client): Promise<Client | InteractionResponse<boolean> | undefined> {
        return;
    }

    async autocomplete(client: Client, interaction: AutocompleteInteraction) : Promise<void> {
        return;
    }

    async setupTimeouts(client: Client) : Promise<boolean> {
        return false;
    }

    async after(client: Client, interaction:CommandInteraction){
        let subCommand = '';
        try { subCommand = (<any>interaction).options.getSubcommand(); } catch (error) {};
        client.logger.send(`[COMMANDS] ${interaction.user.tag} use command /${interaction.commandName} ${subCommand}`.trim())
    }
}