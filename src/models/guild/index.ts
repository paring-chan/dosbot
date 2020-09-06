import {model, Schema, Document, Model} from 'mongoose'

type ReactionRole = {
    msg: string,
    role: string
}

export interface DosGuild extends Document {
    id: string,
    prefix: string,
    disabledCommands: Array<string>,
    reactionRoles: Array<ReactionRole>,
    inMsg: string|undefined,
    outMsg: string|undefined,
    inChn: string|undefined,
    outChn: string|undefined
}

export const guildSchema = new Schema({
    id: String,
    prefix: {
        default: '다스야 ',
        type: String
    },
    disabledCommands: {
        default: [],
        type: Array
    },
    reactionRoles: {
        default: [],
        type: Array
    },
    inMsg: {
        default: '',
        type: String
    },
    outMsg: {
        default: '',
        type: String
    },
    inChn: {
        default: '',
        type: String
    },
    outChn: {
        default: '',
        type: String
    }
})

let guild: Model<DosGuild>

try {
    guild = model<DosGuild>('guild')
} catch (e) {
    guild = model<DosGuild>('guild', guildSchema)
}

export default guild
