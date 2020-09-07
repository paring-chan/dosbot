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
    if (!req.body.channel) {
        return res.json({error: 'channel must not be empty'})
    }

    if (req.body.channel.includes('\'')) {
        return res.status(400).json({error: 'Invalid target'})
    }

    if (!guild.channels.includes(req.body.channel)) {
        return res.status(401).json({error: 'Target channel must be exists in guild'})
    }
    const data = await req.models.Guild.findOne({id: req.query.id})

    data.inMsg = req.body.content
    data.inChn = req.body.channel

    await data.save()

    return res.json({result: true})
}