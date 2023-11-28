import { Client, ClientOptions, Collection } from "discord.js";
import Logger from "./Logger";
import { PrismaClient } from "@prisma/client";
import { prisma } from "../prisma/db";
import { IClientStore } from "../utils/types";

export default class DiscordClient extends Client<true> {
	readonly logger: Logger = new Logger(this);
	prisma: PrismaClient = prisma;
	store: IClientStore = {
		events: [],
		commands: new Collection()
	};

	constructor(data: ClientOptions) {
		super(data);
	}
}