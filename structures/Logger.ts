import { TextChannel, VoiceChannel, User } from "discord.js";
import Client from "./Client";
import Config from "./Config";

type FormatLogOptions = {
    maxIndexLength?: number,
    error?: boolean, 
    type?: string,
    user?: User,
    channel?: TextChannel | VoiceChannel,
    customId?: string
} | null;

export default class Logger {
    logs = new Map();
    client: Client | null = null;
    channel: TextChannel | null = null;

    constructor() {}

    async init(client: Client):Promise<void> {
        this.client = client;
    }

    send(text: string | Error, options: FormatLogOptions = null): void {
        try {
            if (Config.debug || !this.channel) {
                text = text instanceof Error? `${text}` : text;
                return this.client?.logger.formatLog(text, options);
            }
        } catch (error: any) {
            this.client?.logger.error(error);
        }
    }

    error(text: string | Error) {
        text = `${text}`;
        this.client?.logger.formatLog(text, {type: 'error'})
    }

    formatLog(text:string, options: FormatLogOptions){
        const opts = Object.assign({ maxIndexLength: 30 }, options);
        let index: string, message:string;
        if(options?.type && options.type === 'error'){
            [index, message] = text.split(':');
        }else{
            index = text.split(']')?.[0]+']';
            message = text.split(index)[1];      
        }

        index.trim();
        message.trim();
        
        if(options?.type && options?.type == 'error' && !index) index = "[ERROR]";

        if(opts.user) message = message.replace('<user>', `${opts.user.tag}`);
        if(opts.channel) message = message.replace('<channel>', `${opts.channel.name}(${opts.channel.id})`);
        if(opts.customId) {
            message = message.replace('<customId>', `, customId = ${opts.customId}`);
        }else {
            message = message.replace('<customId>', '');
        }

        const finalMessage = this.makeSymmetric(options?.type === 'error' ? index : index.match(/\[(.*?)\]/)?.[1] as string, opts.maxIndexLength)
        return console.log(`${finalMessage}${"["+this.client?.logger.getCurrentTime()+"]"} ${message.trim()}`);
    }

    getCurrentTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
    
        const formattedTime = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        return formattedTime;
    }


    makeSymmetric(message:string, maxLength: number = 30) {
        const currentLength = message.length;
        if(message.trim().length > 30) return `[${message}]`
        if (currentLength === maxLength) {
            return message;
        } else if (currentLength < maxLength) {
            const spacesToAdd = maxLength - currentLength;
            const leftSpaces = Math.floor(spacesToAdd / 2);
            const rightSpaces = spacesToAdd - leftSpaces;
            const leftPadding = ' '.repeat(leftSpaces);
            const rightPadding = ' '.repeat(rightSpaces);
            return '[' + leftPadding + message + rightPadding + ']';
        } else {
            const spacesToRemove = currentLength - maxLength;
            const trimmedMessage = message.slice(spacesToRemove / 2, currentLength - spacesToRemove / 2);
            return '[' + trimmedMessage + ']';
        }
    }
}