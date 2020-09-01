import Command from '../../types/Command'
import emojis from '../../tools/emojis'
import {Track, Utils} from 'erela.js'

const forward: Command = {
    name: '빨리감기',
    id: 'forward',
    group: 'music',
    aliases: ['forward'],
    guildOnly: true,
    async run(msg) {
        if (!msg.args[0]) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.loading} 명령어 사용법: ${msg.prefix}빨리감기 <시간(초)>`)
            return msg.channel.send(embed)
        }

        if (!msg.client.music.players.get(msg.guild!.id)) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 이 서버에서 음악을 재생하고 있지 않아요!`)
            return msg.channel.send(embed)
        }
        const player = msg.client.music.players.get(msg.guild!.id)!
        const queue: Array<Track> = player.queue
        if ((player.position + (Number(msg.args[0]) * 1000)) > queue[0].duration) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(`${emojis.no} 빨리감기 한 시간은 곡의 길이보다 길 수 없어요!`)
            return msg.channel.send(embed)
        }

        player.seek((player.position + (Number(msg.args[0]) * 1000)))

        const embed = msg.createEmbed()
        embed.setFooter('')
        embed.setDescription(`${emojis.yes} ${Utils.formatTime(player.position, true)}로 시간을 이동했어요.`)
        msg.channel.send(embed)
    }
}

export default forward
