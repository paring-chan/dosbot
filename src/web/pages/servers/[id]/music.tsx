import React, {Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {Card, CardContent, Grid, ListItem, ListItemSecondaryAction, ListItemText, Switch} from '@material-ui/core'

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
                                <Grid item xs={12} md={4}>
                                    <Card variant="outlined">
                                        <ListItem>
                                            <ListItemText primary="재생"/>
                                            <ListItemSecondaryAction>
                                                <Switch checked={this.state.play} onClick={this.update('play')}/>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Card variant="outlined">
                                        <ListItem>
                                            <ListItemText primary="스킵"/>
                                            <ListItemSecondaryAction>
                                                <Switch checked={this.state.skip} onClick={this.update('skip')}/>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Card>
                                </Grid>
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