import Command from '../../types/Command'
import emojis from '../../tools/emojis'
import {Utils} from 'erela.js'

const seek : Command = {
    aliases: ['seek'],
    guildOnly: true,
    group: 'music',
    id: 'seek',
    name: '시간이동',
    async run(msg) {
        if (!msg.args.length) {
            const embed = msg.createEmbed()
            embed.setDescription(`${emojis.loading} 명령어 사용법: ${msg.prefix}시간이동 <시간>`)
            embed.setFooter('')
        }

        const player = msg.client.music.players.get(msg.guild!.id)
        if (!player) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 이 서버에서 재생중인 곡이 없어요!`)
            return msg.channel.send(embed)
        }

        if (msg.args[0].includes('.') || msg.args[0].split(':').some((r) => isNaN(Number(r)))) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} ${msg.args[0]}으로 시간을 이동할 수 없어요!`)
            return msg.channel.send(embed)
        }

        let time = 0

        const splitted = msg.args[0].split(':').map(r => parseInt(r))

        if (splitted.length === 1) {
            time = splitted[0] * 1000
        } else if (splitted.length === 2) {
            time = (splitted[0] * 60 * 1000) + (splitted[1] * 1000)
        } else if (splitted.length === 3) {
            time = (splitted[0] * 60 * 60 * 1000) + (splitted[1] * 60 * 1000) + (splitted[2] * 1000)
        } else {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} ${msg.args[0]}으로 시간을 이동할 수 없어요!`)
            return msg.channel.send(embed)
        }

        console.log(time)

        player.seek(time)

        const embed = msg.createEmbed()
        embed.setFooter('')
        embed.setDescription(`${emojis.yes} ${Utils.formatTime(player.position, true)}로 시간을 이동했어요.`)
        msg.channel.send(embed)
    }
}

export default seek
