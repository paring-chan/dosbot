import {MessageEmbed} from 'discord.js'
import {ErelaClient} from 'erela.js'

declare module 'discord.js' {
    interface Message {
        createEmbed() : MessageEmbed
        args: Array<string>
        prefix: string
    }
    interface Client {
        music: ErelaClient
    }
}

