import React, {Component} from 'react'
import Layout from '../components/Layout'
import {serverSideProps} from '../utils/init'
import AwesomeSlider from 'react-awesome-slider'
import {Button, Grid, Typography} from '@material-ui/core'
import Link from 'next/link'


class Index extends Component<any> {
    render() {
        return (
            <Layout noToolbar {...this.props} noContainer noCard>
                <AwesomeSlider animation="fallAnimation" style={{
                    width: '100vw',
                    height: '100vh'
                }} bullets={false}>
                    <div style={{background: '#fff'}}>
                        <Typography align="center" variant="h4">다스봇</Typography>
                        <Typography variant="h6" align="center">다기능 디스코드 봇</Typography>
                        <Grid container justify="center">
                            <Grid item>
                                {
                                    this.props.pageProps.user ?
                                        <Link href="/servers">
                                            <Button color="primary">
                                                대시보드
                                            </Button>
                                        </Link> :
                                        <Button component="a" href="/auth/login" color="primary">
                                            로그인
                                        </Button>
                                }
                            </Grid>
                        </Grid>
                    </div>
                    <div>
                        <Typography style={{color: '#fff'}} variant="h4" align="center">링크</Typography>
                        <Grid container justify="center">
                            <Grid item>
                                <Button target="_blank" component="a" href="https://github.com/parangee/dosbot" style={{color: '#fff'}}>
                                    오픈소스 프로젝트
                                </Button>
                                <Button target="_blank" component="a" href="https://docs.dosbot.tk" style={{color: '#fff'}}>
                                    다스봇 문서
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </AwesomeSlider>
            </Layout>
        )
    }
}

export const getServerSideProps = serverSideProps

export default Index