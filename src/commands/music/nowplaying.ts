import Command from '../../types/Command'
import emojis from '../../tools/emojis'
import {Track, Utils} from 'erela.js'
import {MessageEmbed, Util} from 'discord.js'
import {NowPlayingEmbed} from '../../tools/music/embed'

const np: Command = {
    name: '현재곡',
    id: 'nowplaying',
    group: 'music',
    guildOnly: true,
    aliases: ['np'],
    async run(msg) {
        const player = msg.client.music.players.get(msg.guild!.id)
        if (!player || !player.queue[0]) {
            const embed = msg.createEmbed()
            embed.setColor('RED')
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 현재 재생중인 곡이 없어요!`)
            return msg.channel.send(embed)
        }
        const t: Track = player.queue[0]

        const embed = NowPlayingEmbed(player, t)
        const m = (await msg.channel.send(embed))
        await m.react('🔄')
        msg.client.music.nowPlayingMessages.set(msg.guild!.id, m.id)
    }
}

export default np
