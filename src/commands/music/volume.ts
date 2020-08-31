import Command from '../../types/Command'
import emojis from '../../tools/emojis'

const volume: Command = {
    id: 'volume',
    aliases: ['vol', 'volume'],
    guildOnly: true,
    group: 'music',
    name: '볼륨',
    async run(msg) {
        const player = msg.client.music.players.get(msg.guild!.id)
        if (!player) {
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
        if (player.voiceChannel.id !== msg.member!.voice.channelID) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 곡을 재생중인 음성채널에 들어가주세요!`)
            return msg.channel.send(embed)
        }

        if (isNaN(Number(msg.args[0])) || Number(msg.args[0]) > 100 || Number(msg.args[0]) <= 0) {
            const embed = msg.createEmbed()

            embed.setFooter('')
            embed.setDescription(`${emojis.loading} 사용법: ${msg.prefix}볼륨 <1~100>`)

            return msg.channel.send(embed)
        }

        player.setVolume(Number(msg.args[0]))

        const embed = msg.createEmbed()

        embed.setFooter('')
        embed.setDescription(`${emojis.yes} 볼륨을 ${msg.args[0]}으로 설정했어요.`)

        return msg.channel.send(embed)
    }
}

export default volume
