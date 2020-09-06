import {GuildMember, TextChannel} from 'discord.js'
import {Guild} from '../models'

export async function join(member: GuildMember) {
    const gd = (await Guild.findOne({id: member.guild.id}))!
    if (!gd.inMsg || gd.inMsg === '') return
    const c = <TextChannel|undefined>member.guild.channels.cache.filter(r => r.type === 'text').get(gd.inChn || '')

    if (!c) return

    await c.send(gd.inMsg)
}