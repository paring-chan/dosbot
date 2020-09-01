import React, {ChangeEvent, Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {GetServerSidePropsContext} from 'next'
import {Request} from 'express'
import {Button, ListItemText, TextField, Typography} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'

class ChannelMSG extends Component<any, any> {
    componentDidMount(): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }

    constructor(props) {
        super(props)
    }

    componentDidUpdate(prevProps: Readonly<any>, _: Readonly<any>, snapshot?: null): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }

    state = {
        data: this.props.pageProps.reactionRoles,
        channel: null,
        content: '',
        role: null
    }

    updateContent(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({content: e.target.value})
    }

    async submit() {
        if (!this.state.channel) {
            return alert('채널을 선택해주세요')
        }
        if (this.state.content === '') {
            return alert('메시지를 입력해주세요')
        }
        if (this.state.content.length > 1000) {
            return alert('메시지는 최대 1000글자입니다.')
        }

        const guild = this.props.pageProps.guild

        const res = await (await fetch(`/api/servers/${guild.id}/utils/chnmsg`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: this.props.pageProps.channels.find(r => r.id === this.state.channel).id,
                content: this.state.content,
                role: this.state.role
            })
        })).json()

        if (res.error) {
            return alert('오류가 발생했습니다: ' + res.error)
        }

        if (res.result) {
            return alert('전송되었습니다.')
        }
    }


    render() {
        const guild = this.props.pageProps.guild
        return (
            <Layout {...this.props}>
                {
                    this.props.pageProps.user && guild ? (
                        <>
                            <Autocomplete options={this.props.pageProps.channels.map(r => r.id)}
                                renderInput={(props: any) => (
                                    <TextField {...props} label="채널 선택"/>
                                )} renderOption={(option) => {
                                    const o = this.props.pageProps.channels.find(r => r.id === option)
                                    return (
                                        <>
                                            <ListItemText primary={o?.name}/>
                                        </>
                                    )
                                }} value={this.state.channel} onChange={(e, newValue) => {
                                    this.setState({
                                        channel: newValue
                                    })
                                }}/>
                            <div style={{height: 10}}/>
                            <TextField fullWidth label="메시지를 입력하세요" multiline
                                onChange={this.updateContent.bind(this)} value={this.state.content}/>
                            <Button color="secondary" style={{width: '100%'}}
                                onClick={this.submit.bind(this)}>전송</Button>

                        </>
                    ) : '누구세요'
                }
            </Layout>
        )
    }
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
    const guildData = await withGuild(ctx)

    if (!guildData.props.guild) return guildData

    const req: Request = ctx.req as Request

    const guild = guildData.props.guild

    return {
        props: {
            ...guildData.props,
            members: (await req.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')?.members.cache.filter(r => !r.user.bot).map(r => r.user.toJSON())`)).filter(r => r)[0],
            channels: (await req.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')?.channels.cache.filter(r => r.type === 'text' || r.type === 'news').map(r => r.toJSON())`)).filter(r => r)[0],
        }
    }
}

export default ChannelMSG