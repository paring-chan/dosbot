import {GuildMember, TextChannel} from 'discord.js'
import {Guild} from '../models'

export async function join(member: GuildMember) {
    const gd = (await Guild.findOne({id: member.guild.id}))!
    if (!gd.inMsg || gd.inMsg === '') return
    const c = <TextChannel|undefined>member.guild.channels.cache.filter(r => r.type === 'text').find(r => r.id === (gd.inChn ? gd.inChn : ''))

    let res = gd.inMsg

    const placeholders = [{
        name: '@member',
        to: member.toString()
    }, {
        name: 'member',
        to: member.user.tag
    }, {
        name: 'guild',
        to: member.guild.name
    }, {
        name: 'guild.members',
        to: member.guild.memberCount
    }]

    // @ts-ignore
    placeholders.forEach((placeholder: {name: string, to: string}) => {
        res = res.replace(`{${placeholder.name}}`, placeholder.to)
    })

    if (!c) return

    await c.send(res)
}

export async function leave(member: GuildMember) {
    const gd = (await Guild.findOne({id: member.guild.id}))!
    if (!gd.outMsg || gd.outMsg === '') return
    const c = <TextChannel|undefined>member.guild.channels.cache.filter(r => r.type === 'text').find(r => r.id === (gd.outChn ? gd.outChn : ''))

    let res = gd.outMsg

    const placeholders = [{
        name: 'member',
        to: member.user.tag
    }, {
        name: 'guild',
        to: member.guild.name
    }, {
        name: 'guild.members',
        to: member.guild.memberCount
    }]

    // @ts-ignore
    placeholders.forEach((placeholder: {name: string, to: string}) => {
        res = res.replace(`{${placeholder.name}}`, placeholder.to)
    })

    if (!c) return

    await c.send(res)
}
