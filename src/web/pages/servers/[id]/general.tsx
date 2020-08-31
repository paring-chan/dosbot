import React, {Component} from 'react'
import {withGuild} from '../../../utils/init'
import Layout from '../../../components/Layout'
import Router from 'next/router'
import {
    Button,
    Card,
    CardContent, DialogActions, DialogContent,
    Grid,
    List,
    ListItem,
    ListItemSecondaryAction,
    ListItemText,
    Switch,
    TextField
} from '@material-ui/core'

class General extends Component<any, any> {
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
                    prefix: this.props.pageProps.guild.config.prefix
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

    render() {
        const guild = this.props.pageProps.guild
        return (
            <Layout {...this.props}>
                {
                    this.props.pageProps.user && guild ? (
                        <>
                            <DialogContent>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <TextField onChange={e => this.setState({prefix: e.target.value})} fullWidth value={this.state.prefix} label="접두사"/>
                                    </Grid>
                                </Grid>
                                <Button style={{marginTop: 10}} onClick={async () => {
                                    const data = await (await fetch(`/api/servers/${this.props.pageProps.guild.id}/update`, {
                                        method: 'POST',
                                        body: JSON.stringify({
                                            prefix: this.state.prefix
                                        }),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    })).json()

                                    console.log(data)
                                    await Router.push('/servers/[id]', `/servers/${guild.id}`)
                                }}>
                                    저장
                                </Button>
                            </DialogContent>
                        </>
                    ) : '누구세요'
                }
            </Layout>
        )
    }
}

export const getServerSideProps = withGuild

export default General