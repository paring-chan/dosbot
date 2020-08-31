import {ShardingManager} from 'discord.js'
import path from 'path'
import next from 'next'
import express from 'express'
import passport from 'passport'
import {Strategy} from 'passport-discord'
import * as http from 'http'
import chokidar from 'chokidar'
import session from 'express-session'
import mongoose from 'mongoose'

const config = require('../config.json')

const manager = new ShardingManager(path.join(__dirname, 'bot.ts'), {
    totalShards: config.sharding.total,
    token: process.env.BOT_TOKEN,
    respawn: true,
    execArgv: ['-r', 'ts-node/register']
})

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))

declare global {
    namespace Express {
        interface Request {
            shard: ShardingManager
            models: any
        }
    }
}

manager.spawn().then(async () => {
    await mongoose.connect(config.db, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    const app = next({
        dev: process.env.NODE_ENV !== 'production',
        dir: path.join(__dirname, 'web')
    })

    const handle = app.getRequestHandler()

    await app.prepare()

    passport.serializeUser((user, done) => {
        done(null, JSON.stringify(user))
    })

    passport.deserializeUser((user: string, done) => {
        done(null, JSON.parse(user))
    })

    passport.use(new Strategy({
        clientID: config.web.oauth2.clientID,
        clientSecret: config.web.oauth2.clientSecret,
        callbackURL: config.web.oauth2.callback,
        scope: ['identify', 'guilds']
    }, ((accessToken, refreshToken, profile, done) => {
        return done(null, profile)
    })))

    const app1 = express()

    const server1 = http.createServer(app1)

    app1.listen = function () {
        console.log('listen')
        // eslint-disable-next-line prefer-rest-params,@typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line prefer-rest-params,prefer-spread
        return server1.listen.apply(server1, arguments)
    }

    function pathCheck(id: string) {
        return (
            id.startsWith(path.join(__dirname, 'web', 'routes'))
        )
    }

    function restart() {
        Object.keys(require.cache).forEach((id) => {
            if (pathCheck(id)) {
                console.log(`Reloaded ${id}`)
                delete require.cache[id]
            }
        })
    }

    chokidar.watch(path.join(__dirname, 'web', 'routes')).on('all', (e, at) => {
        if (e === 'add') {
            console.log(`Watching for ${at}`)
        }

        if (e === 'change') {
            console.log(`Changes at ${at}`)
            restart()
        }
    })

    app1.use(session({
        resave: false,
        saveUninitialized: false,
        secret: config.web.sessionSecret
    }))


    app1.use(passport.initialize())

    app1.use(passport.session())

    app1.use((req, res, next1) => {
        req.shard = manager
        req.models = require('./models')
        next1()
    })

    app1.use('/', (req, res, next1) => {
        require('./web/routes').default(req,res,next1)
    })


    app1.all('*', (req, res) => {
        handle(req, res)
    })

    app1.listen(config.web.port)
})
