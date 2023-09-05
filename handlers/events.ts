import { lstat, readdir } from 'fs/promises';
import { join } from 'path';

import Client from "../structures/Client";
import BaseEvent from "../structures/BaseEvent";

export default async function init(client: Client) {
    walk(client, join(__dirname, '../events/'));
}

async function walk(client: Client, dir: string) {
    let i = 0;
    if (Array.isArray(dir)) return;
    if ( !(await lstat(dir)).isDirectory() ) {
        if(dir.includes('ready')) return;
        const event: BaseEvent = (await import(`${dir}`))?.default;
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else {
            client.on(event.name, (...args) => event.execute(client, ...args));
        }
        return;
    }

    for(let file of (await readdir(dir))) {
        await walk(client, join(dir, file));
        i++;
    }
    client.logger.send(`[HANDLER/EVENTS] Установленно ${i} ивентов.`);
    
    return;
}