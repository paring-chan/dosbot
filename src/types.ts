import {MessageEmbed} from 'discord.js'

declare module 'discord.js' {
    interface Message {
        createEmbed() : MessageEmbed
        args: Array<string>
    }
}