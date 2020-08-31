import {ErelaClient, IErelaOptions, INodesOptions, Utils} from 'erela.js'
import {Client, Collection, MessageEmbed} from 'discord.js'

export default class MusicClient extends ErelaClient {
    constructor(client?: Client, nodes?: INodesOptions[], options?: IErelaOptions) {
        super(client, nodes, options)
        this.on('nodeConnect', () => console.log('Connected to a new lavalink node'))
        this.on('nodeDisconnect', () => console.log('Disconnected from a lavalink node'))
        this.on('nodeDestroy', () => console.log('Destroyed a lavalink node'))
        this.on('nodeCreate', () => console.log('Created a node.'))
        this.on('nodeError', (node, message) => console.log(`node error: ${message}`))
        this.on('nodeReconnect', () => console.log('Reconnected to a lavalink node.'))
        this.on('playerCreate', player => console.log(`Created a player in guild ${player.guild.id}`))
        this.on('playerDestroy', player => console.log(`Destroyed a player in guild ${player.guild.id}`))
        this.on('playerMove', (player, oldChannel, newChannel) => console.log(`Player in guild ${player.guild.id} moved from ${oldChannel.id} to ${newChannel.id}`))
        this.on('trackStart', (player, track) => {
            const embed = new MessageEmbed()
            embed.setTitle(`${track.title} | ${Utils.formatTime(track.duration, true)}`)
            embed.setURL(track.uri)
            embed.setColor('GREEN')
            embed.setImage(`https://img.youtube.com/vi/${track.identifier}/maxresdefault.jpg`)
            embed.setAuthor('음악 재생 시작', player.guild.iconURL({dynamic: true}))
            player.textChannel.send(embed)
        })
        this.on('queueEnd', player => {
            this.players.destroy(player.guild.id)
        })
        this.nowPlayingMessages = new Collection<string, string>()
    }
}