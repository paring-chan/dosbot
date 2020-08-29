import {Message} from 'discord.js'
import Inko from 'inko'
import * as models from '../../models'
import Command from '../../types/Command'
import emojis from '../emojis'

const inko = new Inko()

export default async (msg: Message) : Promise<any> => {
    const config = require('../../../config.json')

    if (msg.author.bot) return

    let prefix : string
    if (msg.guild) {
        prefix = (await models.Guild.findOne({id: msg.guild.id}))?.prefix || '다스야 '
    } else {
        prefix = ''
    }

    if (!msg.content.startsWith(prefix)) {
        if (msg.content.match(new RegExp(`^<@(!)?${msg.client.user!.id}>`))) {
            const embed = msg.createEmbed()
            embed.setThumbnail(msg.client.user!.avatarURL({dynamic: true})!)
            embed.setDescription(`이 서버의 접두사는 \`${prefix}\` 입니다!`)
            msg.channel.send(embed)
        } else {
            if (msg.author.id === '628595345798201355') {
                prefix = ','
                if (!msg.content.startsWith(prefix)) return
            } else {
                return
            }
        }
    }

    const commands = require('../../commands')

    const args = msg.content.slice(prefix.length).split(/ +/g)

    const cmd = args.shift()!

    const cmdList = commands.getCommandList()

    const command = cmdList.find((r: Command) => (
        r.name === cmd || r.name === inko.ko2en(cmd) || r.name === inko.en2ko(cmd) ||
        r.aliases?.includes(cmd) || r.aliases?.includes(inko.ko2en(cmd)) || r.aliases?.includes(inko.en2ko(cmd))
    ))

    if (!command) return

    msg.args = args

    if (command.guildOnly && !msg.guild) {
        const embed = msg.createEmbed()
        embed.setDescription(`${emojis.no} 이 명령어는 서버에서만 사용 가능해요!`)
        return msg.channel.send(embed)
    }

    if (command.ownerOnly && !config.owners.includes(msg.author.id)) {
        const embed = msg.createEmbed()
        embed.setDescription(`${emojis.no} 이 명령어는 봇 개발자만 사용 가능해요!`)
        return msg.channel.send(embed)
    }

    console.log(`[${msg.author.tag}] ${msg.content.replace('\n', ' ')}`)

    try {
        await command.run(msg)
    } catch (e) {
        const embed = msg.createEmbed()
        embed.setTitle('오류가 발생했습니다')
        embed.setDescription('```js\n' + e.message + '```')
        embed.setColor('RED')
        msg.channel.send(embed)
    }
}
