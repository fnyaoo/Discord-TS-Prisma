'use strict';

import { ApplicationCommandType, ChatInputCommandInteraction, ApplicationCommandData, EmbedBuilder, PermissionsBitField, ChannelType } from "discord.js";
import BaseCommand from "../../structures/BaseCommand";
import Client from "../../structures/Client";
import Config from "../../structures/Config";

export default class Ping extends BaseCommand {

	name: string = "ping";
	usage: string = "Посмотреть информацию о боте";
	type: string[] = [ Config.CommandType.CHAT, Config.CommandType.SLASH_APPLICATION ];
	slash: ApplicationCommandData = {
		name: this.name,
		description: this.usage,
		type: ApplicationCommandType.ChatInput,
		options: [],
	};
	componentsNames: string[] = [];

	constructor() {
		super();
	}

	async execute(client: Client, interaction: ChatInputCommandInteraction) {
		const channelTypes: number[] = [
			ChannelType.GuildText, 
			ChannelType.GuildVoice, 
			ChannelType.GuildAnnouncement,
			ChannelType.AnnouncementThread,
			ChannelType.PublicThread,
			ChannelType.GuildStageVoice,
			ChannelType.GuildForum
		];
	
		const guild = await client.guilds.fetch(Config.guildId);
		const totalMembers = guild.memberCount;
		const totalChannels = guild.channels.cache.map(channel => {
			if(channelTypes.includes(channel.type) && channel.parentId!='869603902906056765' && channel?.permissionsFor(guild.id)?.has([PermissionsBitField.Flags.ViewChannel])) return 1;
			else return 0;
		}).reduce((a:number, b:number):number => { return a + b }, 0);
		
		const voiceConnections = guild.channels.cache.filter((c)=>c.type==ChannelType.GuildVoice).reduce((a:number, c:any) => { return a + c.members.size }, 0)
		
		const embed = new EmbedBuilder()
			.setTitle("Информация об " + client.user.tag)
			.setThumbnail(client.user.displayAvatarURL({ forceStatic: false, size: 1024 }))
			.setDescription(`**
• Всего пользователей: \`${totalMembers || 0}\`
• Всего каналов: \`${totalChannels || 0}\`
• Всего в войсах: \`${voiceConnections}\`
• Время работы: <t:${Math.floor(Number(Date.now() - client.uptime) / 1000)}:R>
• Пинг: \`${client.ws.ping} MS\`
• Используемая память: \`${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB\`**`)
			.setColor((<string & null>Config.colors.empty))
			.setTimestamp()
		return interaction.reply({ embeds: [embed] })
	}
}