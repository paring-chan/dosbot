import React, {Component, ReactNode} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {Avatar, Card, CardContent, CardHeader, Grid, Typography} from '@material-ui/core'
import {BorderOuterTwoTone, Build, Dns, MusicNote} from '@material-ui/icons'
import Link from 'next/link'

class Dashboard extends Component<any> {
    componentDidMount(): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, _: Readonly<any>, snapshot?: null): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }

    render(): ReactNode {
        const guild = this.props.pageProps.guild

        return (
            <Layout {...this.props} noCard>
                {
                    this.props.pageProps.user && guild ?
                        (
                            <Card>
                                <CardHeader title={<Typography variant="h6">
                                    {guild.name}
                                </Typography>} avatar={<Avatar src={guild.icon && `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}>
                                    {
                                        !guild.icon && <Dns/>
                                    }
                                </Avatar>}/>
                                <CardContent>
                                    <Typography style={{
                                        marginBottom: 10
                                    }} variant="h4">
                                        서버 정보
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardHeader title="멤버 수" subheader={guild.fetched.members.length}/>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardHeader title="역할 수" subheader={guild.fetched.roles.length}/>
                                            </Card>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <CardHeader title="이모지 수" subheader={guild.fetched.emojis.length}/>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                    <Typography style={{
                                        marginBottom: 10,
                                        marginTop: 10
                                    }} variant="h4">
                                        서버 관리
                                    </Typography>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/general" as={`/servers/${guild.id}/general`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            일반
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <Dns/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/dm" as={`/servers/${guild.id}/dm`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            DM 보내기
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <Dns/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/reactionrole" as={`/servers/${guild.id}/reactionrole`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            반응 역할
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <BorderOuterTwoTone/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/chnmsg" as={`/servers/${guild.id}/chnmsg`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            채널에 메시지 전송
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <BorderOuterTwoTone/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/music" as={`/servers/${guild.id}/music`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            음악
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <MusicNote/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <Link href="/servers/[id]/utils" as={`/servers/${guild.id}/utils`}>
                                                <Card variant="outlined" style={{
                                                    cursor: 'pointer'
                                                }}>
                                                    <CardHeader title={
                                                        <Typography variant="h6">
                                                            유틸리티
                                                        </Typography>
                                                    } avatar={<Avatar>
                                                        <Build/>
                                                    </Avatar>}/>
                                                </Card>
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ) : '누구세요'
                }
            </Layout>
        )
    }
}

export const getServerSideProps = withGuild

export default Dashboard