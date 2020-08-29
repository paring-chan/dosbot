import Command from '../../types/Command'
import {Message} from 'discord.js'
import {getCommandList} from "../index";

const help: Command = {
    name: '도움말',
    aliases: ['help', '도움'],
    group: 'general',
    async run(msg: Message) {
        const commands = getCommandList()
        const groups = new Set(commands.map(r => r.group))
        const embed = msg.createEmbed()
        for (const group of groups) {
            const cmdList = commands.filter(r => r.group === group)
            embed.addField(group, cmdList.length ? ('`' + cmdList.map(r => r.name).join('` `') + '`') : '없음')
        }
        msg.channel.send(embed)
    }
}

export default help
