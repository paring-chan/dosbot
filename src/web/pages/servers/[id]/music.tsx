import React, {Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {Card, CardContent, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Switch} from '@material-ui/core'

class Music extends Component<any, any> {
    componentDidMount(): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }
    constructor(props) {
        super(props)
        if (this.props.pageProps.guild) {
            if (this.props.pageProps.guild.config) {
                this.state = {
                    play: !this.props.pageProps.guild.config.disabledCommands.includes('play'),
                    skip: !this.props.pageProps.guild.config.disabledCommands.includes('skip'),
                    stop: !this.props.pageProps.guild.config.disabledCommands.includes('stop'),
                    forward: !this.props.pageProps.guild.config.disabledCommands.includes('forward'),
                    backward: !this.props.pageProps.guild.config.disabledCommands.includes('backward'),
                    seek: !this.props.pageProps.guild.config.disabledCommands.includes('seek'),
                    nowplaying: !this.props.pageProps.guild.config.disabledCommands.includes('nowplaying'),
                    volume: !this.props.pageProps.guild.config.disabledCommands.includes('volume'),
                    items: [{
                        name: '재생',
                        id: 'play'
                    },{
                        name: '정지',
                        id: 'stop'
                    },{
                        name: '스킵',
                        id: 'skip'
                    },{
                        name: '되감기',
                        id: 'backward'
                    },{
                        name: '빨리감기',
                        id: 'forward'
                    },{
                        name: '시간이동',
                        id: 'seek'
                    },{
                        name: '현재곡',
                        id: 'nowplaying'
                    },{
                        name: '볼륨',
                        id: 'volume'
                    }]
                }
            } else {
                this.state = {}
            }
        }
    }

    componentDidUpdate(prevProps: Readonly<any>, _: Readonly<any>, snapshot?: null): any {
        if (this.props.pageProps.redirectTo) {
            Router.push(this.props.pageProps.redirectTo)
        }
    }

    update(name) {
        return async () => {
            const g = this.props.pageProps.guild
            // @ts-ignore
            this.state[name] = !((await (await fetch(`/api/servers/${g.id}/toggle/${name}`)).json()).result)
            this.forceUpdate()
        }
    }

    render() {
        const guild = this.props.pageProps.guild
        return (
            <Layout {...this.props}>
                {
                    this.props.pageProps.user && guild ? (
                        <>
                            <Grid container spacing={3}>
                                {
                                    this.state.items.map((item, i) => (
                                        <Grid key={i} item xs={12} md={4}>
                                            <Card variant="outlined">
                                                <List>
                                                    <ListItem>
                                                        <ListItemText primary={item.name}/>
                                                        <ListItemSecondaryAction>
                                                            <Switch checked={this.state[item.id]} onClick={this.update(item.id)}/>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                </List>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>
                        </>
                    ) : '누구세요'
                }
            </Layout>
        )
    }
}

export const getServerSideProps = withGuild

export default Music