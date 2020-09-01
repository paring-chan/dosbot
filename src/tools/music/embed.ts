import {MessageEmbed} from 'discord.js'
import {Player, Track, Utils} from 'erela.js'

export function NowPlayingEmbed(player: Player, t: Track) : MessageEmbed {
    const embed = new MessageEmbed()

    embed.setTitle(`${t.title}`)
    embed.setURL(t.uri)
    embed.addField('시간', `${Utils.formatTime(player.position, true)}/${Utils.formatTime(t.duration, true)}`)
    embed.setColor('GREEN')
    embed.setImage(`https://img.youtube.com/vi/${t.identifier}/maxresdefault.jpg`)
    embed.setAuthor(t.requester.user.tag, t.requester.user.avatarURL({dynamic: true}))
    return embed
}