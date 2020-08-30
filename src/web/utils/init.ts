import {GetServerSidePropsContext} from 'next'

export const serverSideProps : (ctx) => { props: { user: any } } = (ctx) => {
    return {
        props: {
            user: ctx.req.user || null
        }
    }
}

export async function withGuilds (ctx) {
    const fetched = await serverSideProps(ctx)
    if (!fetched.props.user) {
        return {
            props: {
                user: null
            }
        }
    }
    const userGuilds = fetched.props.user.guilds.filter(r => r.permissions & 8)
    const guilds = (await ctx.req.shard.broadcastEval('this.guilds.cache.map(guild => guild.toJSON())')).reduce((acc, cur) => [...acc, ...cur]).filter(r => r !== null)
    const botGuilds = guilds.map(r => r.id).filter(r => userGuilds.map(r => r.id).includes(r))
    return {
        props: {
            user: fetched.props.user,
            guilds: userGuilds.map(r => ({
                ...r,
                bot: botGuilds.includes(r.id),
                fetched: guilds.find(j => j.id === r.id) || null
            }))
        }
    }
}

export async function withGuild(ctx: GetServerSidePropsContext) {
    const fetched = await withGuilds(ctx)
    if (!fetched.props.guilds) {
        return {
            props: {
                ...fetched.props,
                redirectTo: '/'
            }
        }
    }
    if (!fetched.props.guilds.find(guild => guild.id === ctx.params.id && guild.bot)) {
        return {
            props: {
                ...fetched.props,
                redirectTo: '/servers'
            }
        }
    }
    const g = fetched.props.guilds.find(guild => guild.id === ctx.params.id && guild.bot)
    const config = await ctx.req.models.Guild.findOne({id: g.id})
    return {
        props: {
            ...fetched.props,
            guild: {
                ...g,
                config: JSON.parse(JSON.stringify(config))
            }
        }
    }
}
