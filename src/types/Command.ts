import {Message} from 'discord.js'

type Command = {
    name: string,
    aliases?: Array<string>,
    run(msg: Message) : Promise<any>,
    guildOnly?: boolean,
    ownerOnly?: boolean,
    group: string,
    id: string
}

export default Command

export type register = (cmd: Command) => boolean
