import Command from '../../types/Command'
import {Message, MessageAttachment} from 'discord.js'
import qrcode from 'qrcode'

const qr: Command = {
    name: 'qr코드',
    aliases: ['qr'],
    async run(msg: Message): Promise<any> {
        const embed = msg.createEmbed()
        const attach = new MessageAttachment(await qrcode.toBuffer(msg.args.join(' '), {
            width: 1024
        }), 'qrcode.png')
        embed.setTitle('QRCODE')
        embed.attachFiles([attach])
        embed.setImage('attachment://qrcode.png')
        await msg.channel.send(embed)
    },
    group: 'utils'
}

export default qr
