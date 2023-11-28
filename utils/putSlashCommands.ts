import { PermissionsBitField, REST, Routes } from "discord.js";
import client from "..";
import Config from "../structures/Config";

export async function putSlashCommands() {
	try {
		const slashes = client.store.commands.map((cmd) => {
			const { name, type, dmPermission, defaultMemberPermissions } = cmd.slash;

			let description: string | undefined;
			let options: any = null;

			if ("description" in cmd.slash) {
				description = cmd.slash.description;
			}

			if ("options" in cmd.slash) {
				options = cmd.slash.options;
			}

			return {
				name,
				description,
				type,
				options: options || null,
				dm_permission: dmPermission || null,
				default_member_permissions: defaultMemberPermissions
					? PermissionsBitField.resolve(defaultMemberPermissions).toString()
					: null
			};
		});

		const rest = new REST({ version: "10" }).setToken(process.env.TOKEN as string);

		await rest.put(Routes.applicationCommands(Config.clientId), {
			body: slashes
		});

		return true;
	} catch (error) {
		console.error(error);
		return error;
	}
}
