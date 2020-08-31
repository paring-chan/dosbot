import React, {Component, ReactNode} from 'react'
import Layout from '../../components/Layout'
import {withGuilds} from '../../utils/init'
import {Dns} from '@material-ui/icons'
import {Avatar, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Button} from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'

class Servers extends Component<any> {
    render() : ReactNode {
        const u = this.props.pageProps.user
        const guilds = this.props.pageProps.guilds

        return (
            <Layout {...this.props}>
                {
                    u ? (
                        <>
                            <List>
                                {
                                    guilds.map((guild, i) => (
                                        <ListItem button key={i} onClick={() => {
                                            if (guild.bot) {
                                                Router.push('/servers/[id]', `/servers/${guild.id}`)
                                            } else {
                                                window.open('https://discord.com/oauth2/authorize?client_id=689723237403197511&permissions=8&scope=bot&guild_id=' + guild.id)
                                            }
                                        }}>
                                            <ListItemIcon>
                                                <Avatar
                                                    src={guild.icon && `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}>
                                                    {
                                                        !guild.icon && <Dns/>
                                                    }
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText primary={guild.name}/>
                                            <ListItemSecondaryAction>
                                                {
                                                    guild.bot ?
                                                        <Link href="/servers/[id]" as={`/servers/${guild.id}`}>
                                                            <Button variant="outlined" color="secondary">
                                                                관리하기
                                                            </Button>
                                                        </Link> :
                                                        <Button variant="outlined" color="primary" onClick={() => {
                                                            window.open('https://discord.com/oauth2/authorize?client_id=689723237403197511&permissions=8&scope=bot&guild_id=' + guild.id)
                                                        }}>
                                                            초대하기
                                                        </Button>
                                                }
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))
                                }
                            </List>
                        </>
                    ) : '이 페이지에 접근하려면 로그인 해야 합니다.'
                }
            </Layout>
        )
    }
}

export const getServerSideProps = withGuilds

export default Servers