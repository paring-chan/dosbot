import {Guild} from 'discord.js'
import * as models from '../../models'

export async function register(guild: Guild) : Promise<void> {
    const exists = await models.Guild.exists({id: guild.id})
    if (exists) return
    console.log(`NEW GUILD: ${guild.name}(${guild.id})`)
    const model = new models.Guild({
        id: guild.id
    })
    await model.save()
}