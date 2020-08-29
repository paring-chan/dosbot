import Command from '../../types/Command'
import {Message} from 'discord.js'
import exec from '../../tools/promises/exec'

const reload : Command = {
    name: '리로드',
    ownerOnly: true,
    aliases: ['reload', 'rl'],
    group: 'dev',
    async run(msg: Message) {
        const {
            error, stdout
        } = await exec('tsc')
        if (error) {
            return msg.channel.send('오류\n```ts\n' + stdout?.slice(0, 1900) + (stdout!.length > 1900 ? '...' : '') + '```')
        }
        await msg.client.shard!.broadcastEval('Object.keys(require.cache).filter(r => !r.includes(\'node_modules\')).forEach(c => delete require.cache[c])')
        await msg.reply('모든 샤드에서 모든 명령어가 정상적으로 리로드 되었습니다.')
    }
}

export default reload
