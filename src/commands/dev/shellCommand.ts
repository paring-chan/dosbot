import Command from '../../types/Command'
import {Message} from 'discord.js'
import exec from '../../tools/promises/exec'

const shellCommand: Command = {
    name: 'exec',
    group: 'dev',
    aliases: ['shell'],
    guildOnly: false,
    ownerOnly: true,
    run: async function (msg: Message): Promise<any> {
        const {
            stdout,
            stderr,
            error
        } = await exec(msg.args.join(' '))
        if (stdout) {
            msg.channel.send('STDOUT ```sh\n' + stdout.slice(0,1900) + (stdout.length > 1900 ? '...' : '') + '```')
        }
        if (stderr) {
            msg.channel.send('STDERR ```sh\n' + stderr.slice(0,1900) + (stderr.length > 1900 ? '...' : '') + '```')
        }
        if (error) {
            msg.channel.send('ERROR ```sh\n' + error.message.slice(0,1900) + (error.message.length > 1900 ? '...' : '') + '```')
        }
    }
}

export default shellCommand