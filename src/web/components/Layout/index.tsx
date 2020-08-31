import React, {Component} from 'react'
import {
    AppBar,
    Avatar, Button, Card, CardContent, Container,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Popover,
    Toolbar,
    Typography
} from '@material-ui/core'
import Link from 'next/link'
import * as Icons from '@material-ui/icons'

class Layout extends Component<any> {
    state = {
        popover: null
    }

    render() {
        const u = this.props.pageProps.user

        return (
            <>
                <AppBar style={{
                    boxShadow: 'none',
                    background: this.props.transparent && 'transparent'
                }}>
                    <Toolbar>
                        <Link href="/">
                            <Typography style={{
                                cursor: 'pointer'
                            }} variant="h6">
                                다스봇
                            </Typography>
                        </Link>
                        <div style={{
                            flexGrow: 1
                        }}/>
                        {
                            u ? (
                                <>
                                    <IconButton color="inherit" onClick={e => this.setState({popover: e.target})}>
                                        <Icons.Person/>
                                    </IconButton>
                                    <Popover anchorEl={this.state.popover} open={Boolean(this.state.popover)}
                                        onBackdropClick={() => this.setState({popover: null})}>
                                        <ListItem>
                                            <ListItemIcon>
                                                <Avatar src={`https://cdn.discordapp.com/avatars/${u.id}/${u.avatar}`}/>
                                            </ListItemIcon>
                                            <ListItemText primary={`${u.username}#${u.discriminator}`}/>
                                        </ListItem>
                                        <Link href="/servers">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <Icons.DataUsage/>
                                                </ListItemIcon>
                                                <ListItemText primary="서버 선택"/>
                                            </ListItem>
                                        </Link>
                                        <ListItem button component="a" href="/auth/logout">
                                            <ListItemIcon>
                                                <Icons.LockOpen/>
                                            </ListItemIcon>
                                            <ListItemText primary="로그아웃"/>
                                        </ListItem>
                                    </Popover>
                                </>
                            ) : (
                                <Button component="a" href="/auth/login" color="inherit">
                                    로그인
                                </Button>
                            )
                        }
                    </Toolbar>
                </AppBar>
                {
                    !this.props.noToolbar && <Toolbar style={{
                        marginBottom: 10
                    }}/>
                }
                {
                    this.props.noContainer ?
                        this.props.noCard ?
                            this.props.children
                            : <Card>
                                <CardContent>
                                    {this.props.children}
                                </CardContent>
                            </Card>
                        : <Container>
                            {
                                this.props.noCard ?
                                    this.props.children
                                    : <Card>
                                        <CardContent>
                                            {this.props.children}
                                        </CardContent>
                                    </Card>
                            }
                        </Container>
                }
            </>
        )
    }
}

export default Layout