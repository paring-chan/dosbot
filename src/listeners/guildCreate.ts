import {Guild} from 'discord.js'
import {register} from '../tools/guild'

export default async (guild: Guild) : Promise<void> => {
    await register(guild)
}