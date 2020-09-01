import {Request, Response} from 'express'

export default async (req: Request, res: Response) => {
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method must be POST'})
    }

    if (`${req.query.guild}`.includes('\'')) {
        return res.status(400).json({error: 'Invalid guild'})
    }

    if (!req.user) return res.status(401).json({
        error: 'Unauthorized'
    })

    const userGuilds = req.user.guilds.filter(r => r.permissions & 8)
    const guilds = (await req.shard.broadcastEval('this.guilds.cache.map(guild => guild.toJSON())')).reduce((acc, cur) => [...acc, ...cur]).filter(r => r !== null)
    const botGuilds = guilds.map(r => r.id).filter(r => userGuilds.map(r => r.id).includes(r))
    const guild = guilds.find(guild => guild.id === req.query.id && botGuilds.includes(guild.id))
    if (!guild) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }


    if (!req.body.content) {
        return res.json({error: 'content must not be empty'})
    }
    if (!req.body.channel) {
        return res.json({error: 'channel must not be empty'})
    }

    if (req.body.channel.includes('\'')) {
        return res.status(400).json({error: 'Invalid target'})
    }

    if (!guild.channels.includes(req.body.channel)) {
        return res.status(401).json({error: 'Target channel must be exists in guild'})
    }

    const result = (await req.shard.broadcastEval(`const djs = require('discord.js');this.guilds.cache.get('${req.query.id}')?.channels.cache.get('${req.body.channel}')?.send(
        new djs.MessageEmbed().setDescription(unescape('${escape(req.body.content.slice(0,1000))}')).setFooter('${(req.user.username + '#' + req.user.discriminator).replace('\'', '\\\'')}', 'https://cdn.discordapp.com/avatars/${req.user.id}/${req.user.avatar}')
    )`)).filter(r => r)

    if (!result[0]) {
        return res.json({result: false})
    } else {
        return res.json({result: true})
    }
}