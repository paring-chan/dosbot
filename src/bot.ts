import 'dotenv/config'
import {DosbotClient} from './tools/bot/DosbotClient'
import {connect} from 'mongoose'
import {Message, MessageEmbed} from 'discord.js'
import './typings'

const config = require('../config.json')


Message.prototype.createEmbed = function() {
    const embed = new MessageEmbed()
    embed.setColor('BLUE')
    embed.setFooter(this.author.tag, this.author.avatarURL({dynamic: true}) || '')
    return embed
};


(async () => {
    const client = new DosbotClient()

    await connect(config.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


    await client.login(process.env.BOT_TOKEN)
})()
