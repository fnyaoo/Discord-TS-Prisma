import { HexColorString } from "discord.js";

type TGuildChannels = {
	chat: string;
	commands: string;
};

type TColors = {
	default: HexColorString;
	empty: HexColorString;
};

class Config {
	debug: boolean = true;

	colors: TColors = {
		default: "#63afb9",
		empty: "#2c2f33"
	};

	guildId: string = "";
	clientId: string = "";

	channels: TGuildChannels = {
		chat: "",
		commands: ""
	};

	CommandType = {
		UNSET: "unset",
		CHAT: "chat",
		SLASH: "slash",
		SLASH_APPLICATION: "slash_application",
		CTX_USER: "context_user",
		CTX_MESSAGE: "context_message"
	};

	constructor() {
		return this;
	}
}

export default new Config();
