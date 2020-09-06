import Command from '../../types/Command'

const announce : Command = {
    name: '공지',
    group: 'dev',
    ownerOnly: true,
    id: 'announce',
    async run(msg) {
        if (!msg.args.length) {
            return msg.reply('내용이 없습니다')
        }
        const content = msg.args.join(' ')
        const embed = msg.createEmbed().setDescription(`${content}

공지를 받을 채널 주제에 '-다스봇' 을 넣어주세요!`)
        embed.setTimestamp(new Date())
        const guilds = (await msg.client.shard!.broadcastEval('this.guilds.cache.map(r => r.id)')).reduce((previousValue, currentValue) => [...previousValue, ...currentValue])
        for (const guild of guilds) {
            console.log(guild)
            await msg.channel.send(guild)
            try {
                await msg.client.shard!.broadcastEval(`const djs = require('discord.js')
                    const channels = this.guilds.cache.get('${guild}')?.channels.cache.filter(r => r.permissionsFor(r.guild.me).has(['SEND_MESSAGES']) && r.type === 'text' || r.type === 'news').map(r => r)
                    if (channels) { const chn = channels.find(r => r.topic?.includes('-다스봇')) || channels[0]; chn?.send(new djs.MessageEmbed(${JSON.stringify(embed.toJSON())})) }`)
            } catch (e) {
                console.error(e.stack)
            }
        }
        await msg.reply('전송 완료')
    }
}

export default announce