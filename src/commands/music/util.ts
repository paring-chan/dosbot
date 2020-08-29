import {Message} from 'discord.js'
import {Player} from 'erela.js'

export function spawnPlayer(msg: Message) : Player {
    return msg.client.music.players.spawn({
        guild: msg.guild,
        voiceChannel: msg.member!.voice!.channel,
        selfDeaf: true,
        textChannel: msg.channel
    })
}