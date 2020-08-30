import {Request, Response} from 'express'

export default async (req: Request, res: Response) => {
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

    let result

    if (data.disabledCommands.includes(req.query.name)) {
        data.disabledCommands.splice(data.disabledCommands.indexOf(req.query.name), 1)
        result = false
    } else {
        data.disabledCommands.push(req.query.name)
        result = true
    }

    await req.models.Guild.update({id: req.query.id}, data)

    res.json({result})
}