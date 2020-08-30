import Command from '../../types/Command'
import {Message} from 'discord.js'

const restart : Command = {
    name: 'rs',
    group: 'dev',
    id: 'restart',
    ownerOnly: true,
    async run(msg: Message): Promise<any> {
        const embed = msg.createEmbed()
        embed.setDescription('샤드 전체 재시작중....')
        await msg.channel.send(embed)
        return msg.client.shard!.broadcastEval('process.exit()')
    }
}

export default restart
