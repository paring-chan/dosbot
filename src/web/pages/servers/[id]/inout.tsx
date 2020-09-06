import React, {ChangeEvent, Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {GetServerSidePropsContext} from 'next'
import {Request} from 'express'
import {
    Button,
    Card,
    CardContent,
    ListItemText,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    TextField,
    Typography
} from '@material-ui/core'
import {Autocomplete} from '@material-ui/lab'

class ChannelMSG extends Component<any, any> {
    componentDidMount(): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
        this.setState({
            placeholders: [
                {
                    name: '{@member}',
                    example: '@' + this.props.pageProps.user?.username + this.props.pageProps.user?.discriminator,
                    desc: '멤버를 멘션합니다. 입장 메시지에서만 사용할 수 있습니다.'
                }, {
                    name: '{member}',
                    example: this.props.pageProps.user?.username + this.props.pageProps.user?.discriminator,
                    desc: '멤버의 태그를 표시합니다.'
                }, {
                    name: '{guild}',
                    example: this.props.pageProps.guild?.name,
                    desc: '서버 이름을 표시합니다.'
                }, {
                    name: '{guild.members}',
                    example: this.props.pageProps.guild?.fetched.members?.length,
                    desc: '서버의 멤버 수를 표시합니다.'
                }
            ]
        })
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
        inChannel: this.props.pageProps.guild?.config?.inChn,
        outChannel: this.props.pageProps.guild?.config?.outChn,
        outContent: this.props.pageProps.guild?.config?.outMsg,
        inContent: this.props.pageProps.guild?.config?.inMsg,
        placeholders: []
    }

    updateInContent(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({inContent: e.target.value})
    }

    updateOutContent(e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        this.setState({outContent: e.target.value})
    }

    async submitIn() {
        if (!this.state.inChannel) {
            return alert('채널을 선택해주세요')
        }
        if (this.state.inContent === '') {
            return alert('메시지를 입력해주세요')
        }
        if (this.state.inContent.length > 1000) {
            return alert('메시지는 최대 1000글자입니다.')
        }

        const guild = this.props.pageProps.guild

        const res = await (await fetch(`/api/servers/${guild.id}/utils/inout/in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: this.props.pageProps.channels.find(r => r.id === this.state.inChannel).id,
                content: this.state.inContent
            })
        })).json()

        if (res.error) {
            return alert('오류가 발생했습니다: ' + res.error)
        }

        if (res.result) {
            return alert('저장되었습니다.')
        }
    }

    async submitOut() {
        if (!this.state.outChannel) {
            return alert('채널을 선택해주세요')
        }
        if (this.state.outContent === '') {
            return alert('메시지를 입력해주세요')
        }
        if (this.state.outContent.length > 1000) {
            return alert('메시지는 최대 1000글자입니다.')
        }

        const guild = this.props.pageProps.guild

        const res = await (await fetch(`/api/servers/${guild.id}/utils/inout/out`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                channel: this.props.pageProps.channels.find(r => r.id === this.state.outChannel).id,
                content: this.state.outContent,
            })
        })).json()

        if (res.error) {
            return alert('오류가 발생했습니다: ' + res.error)
        }

        if (res.result) {
            return alert('저장되었습니다.')
        }
    }


    render() {
        const guild = this.props.pageProps.guild
        return (
            <Layout {...this.props} noCard>
                {
                    this.props.pageProps.user && guild ? (
                        <>
                            <Card>
                                <CardContent>
                                    IN
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
                                        }} value={this.state.inChannel} onChange={(e, newValue) => {
                                            this.setState({
                                                inChannel: newValue
                                            })
                                        }}/>
                                    <div style={{height: 10}}/>
                                    <TextField fullWidth label="메시지를 입력하세요" multiline
                                        onChange={this.updateInContent.bind(this)} value={this.state.inContent}/>
                                    <Button color="secondary" style={{width: '100%'}}
                                        onClick={this.submitIn.bind(this)}>저장</Button>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent>
                                    OUT
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
                                        }} value={this.state.outChannel} onChange={(e, newValue) => {
                                            this.setState({
                                                outChannel: newValue
                                            })
                                        }}/>
                                    <div style={{height: 10}}/>
                                    <TextField fullWidth label="메시지를 입력하세요" multiline
                                        onChange={this.updateOutContent.bind(this)}
                                        value={this.state.outContent}/>
                                    <Button color="secondary" style={{width: '100%'}}
                                        onClick={this.submitOut.bind(this)}>저장</Button>
                                </CardContent>
                            </Card>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>이름</TableCell>
                                            <TableCell>설명</TableCell>
                                            <TableCell>예시</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            this.state.placeholders.map((r, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{r.name}</TableCell>
                                                    <TableCell>{r.desc}</TableCell>
                                                    <TableCell>{r.example}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
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

    console.log(guild.config)

    return {
        props: {
            ...guildData.props,
            members: (await req.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')?.members.cache.filter(r => !r.user.bot).map(r => r.user.toJSON())`)).filter(r => r)[0],
            channels: (await req.shard.broadcastEval(`this.guilds.cache.get('${guild.id}')?.channels.cache.filter(r => r.type === 'text' || r.type === 'news').map(r => r.toJSON())`)).filter(r => r)[0],
        }
    }
}

export default ChannelMSG