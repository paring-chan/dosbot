import Command from '../../types/Command'
import {Message} from 'discord.js'
import exec from '../../tools/promises/exec'

const shellCommand: Command = {
    name: 'shell',
    group: 'dev',
    aliases: ['exec', 'exc'],
    guildOnly: false,
    ownerOnly: true,
    run: async function (msg: Message): Promise<any> {
        const {
            stdout,
            stderr,
        } = await exec(msg.args.join(' '))
        if (stdout) {
            await msg.channel.send('STDOUT ```sh\n' + stdout.slice(0,1900) + (stdout.length > 1900 ? '...' : '') + '```')
        }
        if (stderr) {
            await msg.channel.send('STDERR ```sh\n' + stderr.slice(0,1900) + (stderr.length > 1900 ? '...' : '') + '```')
        }
    }
}

export default shellCommand