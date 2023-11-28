import { Collection } from "discord.js";
import BaseCommand from "../structures/BaseCommand";

export interface IClientStore {
	events: string[];
	commands: Collection<string, BaseCommand>;
}
