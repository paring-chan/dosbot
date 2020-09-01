import {model, Schema, Document, Model} from 'mongoose'

type ReactionRole = {
    msg: string,
    role: string
}

export interface DosGuild extends Document {
    id: string,
    prefix: string,
    disabledCommands: Array<string>,
    reactionRoles: Array<ReactionRole>
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
    }
})

let guild: Model<DosGuild>

try {
    guild = model<DosGuild>('guild')
} catch (e) {
    guild = model<DosGuild>('guild', guildSchema)
}

export default guild
