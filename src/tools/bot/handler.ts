import {Message} from 'discord.js'
import Inko from 'inko'
import * as models from '../../models'
import {DosGuild} from '../../models/guild'
import Command from '../../types/Command'
import emojis from '../emojis'

const inko = new Inko()

export default async (msg: Message): Promise<any> => {
    const config = require('../../../config.json')

    if (msg.author.bot) return

    let guildConfig: DosGuild | null

    if (msg.guild) {
        guildConfig = await models.Guild.findOne({id: msg.guild.id})
    }

    let prefix: string
    if (msg.guild) {
        prefix = (guildConfig!.prefix || '다스야 ')
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

    msg.prefix = prefix

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

    if (msg.guild && guildConfig!.disabledCommands.includes(command.id)) {
        const embed = msg.createEmbed()
        embed.setDescription(`${emojis.no} 이 명령어는 이 서버에서 비활성화 되어있어요!`)
        embed.setFooter('')
        return msg.channel.send(embed)
    }

    if (command.guildOnly && !msg.guild) {
        const embed = msg.createEmbed()
        embed.setDescription(`${emojis.no} 이 명령어는 서버에서만 사용 가능해요!`)
        embed.setFooter('')
        return msg.channel.send(embed)
    }

    if (command.permissions) {
        if (!msg.guild) {
            const embed = msg.createEmbed()
            embed.setDescription(`${emojis.no} 이 명령어는 서버에서만 사용 가능해요!`)
            embed.setFooter('')
            return msg.channel.send(embed)
        }
        if (!msg.member!.permissions.has(command.permissions!)) {
            const embed = msg.createEmbed()
            embed.setDescription(`${emojis.no} 이 명령어를 사용하려면 다음 권한(들)이 필요해요 \`\`\`
${command.permissions.join(', ')}\`\`\``)
            embed.setFooter('')
            return msg.channel.send(embed)
        }

        if (command.ownerOnly && !config.owners.includes(msg.author.id)) {
            const embed = msg.createEmbed()
            embed.setFooter('')
            embed.setDescription(
                `${emojis.no} 이 명령어는 봇 개발자만 사용 가능해요!`
            )
            return msg.channel.send(embed)
        }

        console.log(
            `[${msg.author.tag}] ${msg.content.replace('\n', ' ')}`
        )

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
}