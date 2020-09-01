import Command from '../../types/Command'
import {Message} from 'discord.js'
import emojis from '../../tools/emojis'

const stop : Command = {
    id: 'stop',
    group: 'music',
    guildOnly: true,
    name: '정지',
    aliases: ['stop'],
    permissions: ['ADMINISTRATOR'],
    async run(msg: Message): Promise<any> {
        if (!msg.client.music.players.get(msg.guild!.id)) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 현재 재생중인 공이 없어요!`)
            return msg.channel.send(embed)
        }
        msg.client.music.players.destroy(msg.guild!.id)
        const embed = msg.createEmbed()
        embed.setFooter('')
        embed.setDescription(`${emojis.yes} 음악을 정지했어요.`)
        return msg.channel.send(embed)
    }
}

export default stop
