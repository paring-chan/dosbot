import Command from '../../types/Command'
import {Message} from 'discord.js'
import emojis from '../../tools/emojis'

const skip: Command = {
    name: '스킵',
    id: 'skip',
    aliases: ['skip'],
    guildOnly: true,
    group: 'music',
    async run(msg: Message): Promise<any> {
        if (!msg.client.music.players.get(msg.guild!.id)) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 여기에서 재생중인 곡이 없어요!`)
            return msg.channel.send(embed)
        }
        if (!msg.member!.voice.channelID) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 곡을 재생중인 음성채널에 들어가주세요!`)
            return msg.channel.send(embed)
        }
        const player = msg.client.music.players.get(msg.guild!.id)!
        if (player.voiceChannel.id !== msg.member!.voice.channelID) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 곡을 재생중인 음성채널에 들어가주세요!`)
            return msg.channel.send(embed)
        }
        player.stop()
        const embed = msg.createEmbed()
        embed.setFooter('')
        embed.setDescription(`${emojis.yes} 곡을 스킵했어요!`)
        msg.channel.send(embed)
    }
}

export default skip
