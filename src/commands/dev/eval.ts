import Command from '../../types/Command'
import {Message} from 'discord.js'

const evalCmd : Command = {
    name: 'eval',
    aliases: ['sc'],
    group: 'dev',
    id: 'eval',
    ownerOnly: true,
    async run(msg: Message): Promise<any> {
        const embed = msg.createEmbed()
        embed.setTitle('EVAL')
        const input = msg.args.join(' ').replace(/^```(js)?/, '').replace(/```$/, '')
        await new Promise(resolve => resolve(eval(`const djs = require('discord.js')
        ${input}`))).then(res => {
            embed.setColor('GREEN')
            const resp = require('util').inspect(res).replace(msg.client.token!, '안된다 이놈아')
            embed.addField('OUTPUT', '```js\n' + resp.slice(0,1000) + (resp.length > 1000 ? '...' : '') + '```')
        }).catch(resp => {
            embed.setColor('RED')
            embed.addField('OUTPUT', '```js\n' + resp.stack.slice(0,1000) + (resp.length > 1000 ? '...' : '') + '```')
        }).finally(async () => {
            const m = await msg.channel.send(embed)
            await m.react('🗑')
            const collector = await m.createReactionCollector((reaction, user) => reaction.emoji.name === '🗑' && user.id === msg.author.id, {
                time: 30000,
                max: 1
            })

            collector.on('collect', async () => {
                await m.delete()
                collector.stop('delete')
            })

            collector.on('end',async (_, reason) => {
                if (reason === 'time') await m.delete()
            })
        })
    }
}

export default evalCmd
