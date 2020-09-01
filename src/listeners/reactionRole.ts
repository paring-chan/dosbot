import {MessageReaction, User} from 'discord.js'
import Guild from '../models/guild'

export async function onRemove(reaction: MessageReaction, user: User) {
    if (!reaction.message.guild) return
    if (user.bot) return
    const guild = reaction.message.guild!
    const member = guild.members.cache.get(user.id)!
    const datas = (await Guild.findOne({id: reaction.message.guild!.id}))?.reactionRoles || []
    if (!datas.map(r => r.msg).includes(reaction.message.id)) return
    if (reaction.emoji.name === '✅') {
        try {
            await member.roles.remove(guild.roles.cache.get(datas.find(r => r.msg === reaction.message.id)!.role)!)
        } catch (e) {
            return
        }
    }
}

export async function onAdd(reaction: MessageReaction, user: User) {
    if (!reaction.message.guild) return
    if (user.bot) return
    const guild = reaction.message.guild!
    const member = guild.members.cache.get(user.id)!
    const datas = (await Guild.findOne({id: reaction.message.guild!.id}))?.reactionRoles || []
    if (!datas.map(r => r.msg).includes(reaction.message.id)) return
    if (reaction.emoji.name === '✅') {
        try {
            await member.roles.add(guild.roles.cache.get(datas.find((r: any) => r.msg === reaction.message.id)!.role)!)
        } catch (e) {
            console.log(e.message)
            return
        }
    }
}
