import Command from '../../types/Command'
import {Message} from 'discord.js'

const reload : Command = {
    name: '리로드',
    id: 'reload',
    ownerOnly: true,
    aliases: ['reload', 'rl'],
    group: 'dev',
    async run(msg: Message) {
        await msg.client.shard!.broadcastEval('Object.keys(require.cache).filter(r => !r.includes(\'node_modules\')).forEach(c => delete require.cache[c])')
        await msg.reply('모든 샤드에서 모든 명령어가 정상적으로 리로드 되었습니다.')
    }
}

export default reload
