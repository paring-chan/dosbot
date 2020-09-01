import {MessageReaction, User} from 'discord.js'
import {NowPlayingEmbed} from '../tools/music/embed'

export default async (reaction: MessageReaction, user: User) => {
    if (!reaction.message.guild) return
    if (reaction.emoji.name !== '🔄') return
    const client = user.client
    if (!client.music.nowPlayingMessages.get(reaction.message.guild!.id)) return
    if (client.music.nowPlayingMessages.get(reaction.message.guild.id) !== reaction.message.id) return
    if (!client.music.nowPlayingMessages.get(reaction.message.guild.id)) return
    const player = client.music.players.get(reaction.message.guild.id)!
    if (!player.queue[0]) return
    await reaction.message.edit(NowPlayingEmbed(player, player.queue[0]))
}
