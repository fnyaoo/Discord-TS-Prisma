# Example of new SlashCommand.ts

```typescript
'use strict';

import { ApplicationCommandType, AutocompleteInteraction, BaseInteraction, CacheType, ChatInputCommandInteraction, ApplicationCommandData } from "discord.js";
import BaseCommand from "../structures/BaseCommand";
import Client from "../structures/Client";
import Config from "../structures/Config";

export default class command extends BaseCommand {

	name: string = "";
	usage: string = "";
	type: string[] = [ Config.CommandType.CHAT, Config.CommandType.SLASH_APPLICATION ];
	slash: ApplicationCommandData = {
		name: this.name,
		description: this.usage,
		type: ApplicationCommandType.ChatInput,
		options: [],
		defaultMemberPermissions: "Administrator" 
	};
	componentsNames: string[] = [];
	constructor() { super();}

	async execute(client: Client, interaction: ChatInputCommandInteraction) {

	}

	async componentListener(client: Client, interaction: BaseInteraction<CacheType>): Promise<boolean> {
		return false;
	}

	async autocomplete(client: Client, interaction: AutocompleteInteraction<CacheType>): Promise<void> {
		return;
	}

	async setupTimeouts(client: Client): Promise<boolean> {
		return false;
	}
}
```

# Example of .env
```env
TOKEN=""
DATABASE_URL=""
```