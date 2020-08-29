import {ShardingManager} from 'discord.js'
import path from 'path'

const config = require('../config.json')

const manager = new ShardingManager(path.join(__dirname, 'bot.js'), {
    totalShards: config.sharding.total,
    token: process.env.BOT_TOKEN
})

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))


manager.spawn().then(() => console.log('Shards spawned'))
