import {model, Schema, Document} from 'mongoose'

export interface DosGuild extends Document {
    id: string,
    prefix: string,
    disabledCommands: Array<string>
}

const guildSchema = new Schema({
    id: String,
    prefix: {
        default: '다스야 ',
        type: String
    },
    disabledCommands: {
        default: [],
        type: Array
    }
})

export default model<DosGuild>('guild', guildSchema)
