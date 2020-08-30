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
                    qrgen: !this.props.pageProps.guild.config.disabledCommands.includes('qrgen'),
                    items: [{
                        name: 'QR코드',
                        id: 'qrgen'
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
                                                <ListItem>
                                                    <ListItemText primary={item.name}/>
                                                    <ListItemSecondaryAction>
                                                        <Switch checked={this.state[item.id]} onClick={this.update(item.id)}/>
                                                    </ListItemSecondaryAction>
                                                </ListItem>
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