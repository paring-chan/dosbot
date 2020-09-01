import {Message, PermissionString} from 'discord.js'

type Command = {
    name: string,
    aliases?: Array<string>,
    run(msg: Message) : Promise<any>,
    guildOnly?: boolean,
    ownerOnly?: boolean,
    group: string,
    id: string,
    permissions?: PermissionString[]
}

export default Command

export type register = (cmd: Command) => boolean
