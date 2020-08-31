import {Request, Response} from 'express'

export default async (req: Request, res: Response) => {
    if (req.method !== 'POST') {
        res.status(405).json({error: 'Method must be POST'})
    }

    if (!req.user) return res.status(401).json({
        error: 'Unauthorized'
    })

    const userGuilds = req.user.guilds.filter(r => r.permissions & 8)
    const guilds = (await req.shard.broadcastEval('this.guilds.cache.map(guild => guild.toJSON())')).reduce((acc, cur) => [...acc, ...cur]).filter(r => r !== null)
    const botGuilds = guilds.map(r => r.id).filter(r => userGuilds.map(r => r.id).includes(r))
    if (!(guilds.find(guild => guild.id === req.query.id && botGuilds.includes(guild.id)))) {
        return res.status(401).json({
            error: 'Unauthorized'
        })
    }


    const data = await req.models.Guild.findOne({id: req.query.id})

    const allowed = ['prefix']

    Object.keys(req.body).forEach(key => {

        console.log(`[UPDATE] guild: ${req.query.id} key: ${key} from: ${data[key]} to: ${req.body[key]}`)
        if (allowed.includes(key)) {
            data[key] = req.body[key]
        }
    })

    await data.save()

    res.json({result: data})
}