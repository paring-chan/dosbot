import {ShardingManager} from 'discord.js'

declare module 'http' {
    interface IncomingMessage {
        user: any
        models: any
    }
}

declare global {
    namespace Express {
        interface Request {
            shard: ShardingManager
        }
    }
}

export default null
