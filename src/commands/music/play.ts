import Command from '../../types/Command'
import {Message, MessageEmbed, Util} from 'discord.js'
import emojis from '../../tools/emojis'
import {spawnPlayer} from './util'
import {Track, Utils} from 'erela.js'

const play: Command = {
    name: '재생',
    group: 'music',
    aliases: ['play', 'p'],
    guildOnly: true,
    async run(msg: Message): Promise<any> {
        if (!msg.member!.voice.channel) {
            const embed = msg.createEmbed()
            embed.setDescription(`${emojis.no} 음성 채널에 들어가주세요!`)
            embed.setFooter('')
            return msg.reply(embed)
        }
        const player = spawnPlayer(msg)

        const res = await msg.client.music.search(msg.args.join(' '), msg.member)

        function getMusicInfoEmbed(track: Track) : MessageEmbed {
            const embed = msg.createEmbed()
            embed.setTitle(`${track.title} | ${Utils.formatTime(track.duration, true)}`)
            embed.setAuthor('곡이 추가되었습니다.', msg.guild!.iconURL({dynamic: true})!)
            return embed
        }

        function getPlaylistInfoEmbed(tracks: Track[]) : MessageEmbed {
            const embed = msg.createEmbed()
            embed.addField('전체 길이', tracks.length ? Utils.formatTime(tracks.map(r => r.duration).reduce((acc,cur) => acc+cur), true) : '0:0', true)
            embed.addField('전체 곡 수', tracks.length, true)
            return embed
        }

        if (res.loadType === 'TRACK_LOADED') {
            await msg.channel.send(getMusicInfoEmbed(res.tracks[0]))
            player.queue.add(res.tracks[0])
            if (!player.playing) player.play()
        } else if (res.loadType === 'PLAYLIST_LOADED') {
            await msg.channel.send(getPlaylistInfoEmbed(res.playlist.tracks))
            res.playlist.tracks.forEach(track => player.queue.add(track))
            if (!player.playing) player.play()
        } else if (res.loadType === 'SEARCH_RESULT') {
            let embed: MessageEmbed
            embed = msg.createEmbed()
            embed.setTitle('1-5 중 선택해주세요. A: 전체 선택/C: 취소 | 30초 후 취소됩니다.')
            embed.setDescription(res.tracks.slice(0,5).map((track, i) => `${i+1} - ${track.title}`))
            embed.setFooter('현재 0개 선택됨', msg.author.avatarURL({dynamic: true}) || undefined)
            const m1 = await msg.channel.send('처리중....')
            const emojiList = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '🅰', '⭕', '❌']
            await Promise.all(emojiList.map(r => m1.react(r)))
            await m1.edit(embed)
            const selected : Array<Track> = []
            const collector = m1.createReactionCollector((reaction, user) => emojiList.includes(reaction.emoji.name) && msg.author.id === user.id, {
                dispose: true,
                time: 30000
            })
            collector.on('collect', async (reaction) => {
                if (reaction.emoji.name === '🅰') {
                    return collector.stop('all')
                }
                if (reaction.emoji.name === '❌') {
                    return collector.stop('cancel')
                }
                if (reaction.emoji.name === '⭕') {
                    return collector.stop('selected')
                }
                selected.push(res.tracks[emojiList.indexOf(reaction.emoji.name)])
                embed.setFooter(`현재 ${selected.length}개 선택됨`, msg.author.avatarURL({dynamic: true}) || undefined)
                await m1.edit(embed)
            })

            collector.on('remove',async (reaction) => {
                const idx = selected.indexOf(res.tracks[emojiList.indexOf(reaction.emoji.name)])
                if (idx === -1) return
                selected.splice(idx, 1)
                embed.setFooter(`현재 ${selected.length}개 선택됨`, msg.author.avatarURL({dynamic: true}) || undefined)
                await m1.edit(embed)
            })

            collector.on('end',async (_, reason) => {
                await m1.delete()
                if (reason === 'time') {
                    embed = msg.createEmbed()
                    embed.setDescription(`${emojis.loading} 시간 초과되어 선택이 취소되었습니다.`)
                    return msg.channel.send(embed)
                }
                if (reason === 'cancel') {
                    embed = msg.createEmbed()
                    embed.setDescription(`${emojis.loading} 선택이 취소되었습니다.`)
                    return msg.channel.send(embed)
                }
                if (reason === 'selected') {
                    if (selected.length === 0) {
                        embed = msg.createEmbed()
                        embed.setDescription(`${emojis.no} 선택한 곡이 없습니다.`)
                        return msg.channel.send(embed)
                    }
                    if (selected.length === 1) {
                        player.queue.add(selected[0])
                        await msg.channel.send(getMusicInfoEmbed(selected[0]))
                        if (!player.playing) player.play()
                        return
                    }
                    await msg.channel.send(getPlaylistInfoEmbed(selected))
                    selected.forEach(track => player.queue.add(track))
                    if (!player.playing) player.play()
                }
                if (reason === 'all') {
                    const tracks = res.tracks.slice(0,5)
                    await msg.channel.send(getPlaylistInfoEmbed(tracks))
                    tracks.forEach(track => player.queue.add(track))
                    if (!player.playing) player.play()
                }
            })
        }
    }
}

export default play
