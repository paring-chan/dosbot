import React, {ChangeEvent, Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {
    Avatar, Button,
    CardContent,
    DialogContent,
    Grid, ListItem, ListItemIcon, ListItemText, TextField
} from '@material-ui/core'
import {GetServerSidePropsContext} from 'next'
import {Request} from 'express'
import {Autocomplete} from '@material-ui/lab'

class DM extends Component<any, any> {
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
        target: null,
        content: ''
    }

    updateContent(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        this.setState({content: e.target.value.slice(0, 1000)})
    }

    async submit() {
        if (!this.state.target) {
            return alert('대상을 선택해주세요')
        }
        if (this.state.content === '') {
            return alert('메시지를 입력해주세요')
        }
        if (this.state.content.length > 1000) {
            return alert('메시지는 최대 1000글자입니다.')
        }

        const guild = this.props.pageProps.guild

        const res = await (await fetch(`/api/servers/${guild.id}/utils/dm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({target: this.props.pageProps.members.find(r => r.tag === this.state.target).id, content: this.state.content})
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
                            <Autocomplete options={this.props.pageProps.members.map(r => r.tag)}
                                renderInput={(props: any) => (
                                    <TextField {...props} label="멤버 선택"/>
                                )} renderOption={(option) => {
                                    const o = this.props.pageProps.members.find(r => r.tag === option)
                                    return (
                                        <>
                                            <ListItemIcon>
                                                <Avatar src={o.avatarURL}/>
                                            </ListItemIcon>
                                            <ListItemText primary={o.tag}/>
                                        </>
                                    )
                                }} value={this.state.target} onChange={(e, newValue) => {
                                    this.setState({
                                        target: newValue
                                    })
                                }}/>
                            <div style={{height: 10}}/>
                            <TextField fullWidth label="메시지를 입력하세요" multiline
                                onChange={this.updateContent.bind(this)} value={this.state.content}/>
                            <Button color="secondary" style={{width: '100%'}} onClick={this.submit.bind(this)}>전송</Button>
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
            members: (await req.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')?.members.cache.filter(r => !r.user.bot).map(r => r.user.toJSON())`)).filter(r => r)[0]
        }
    }
}

export default DM