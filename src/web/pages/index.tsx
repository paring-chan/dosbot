import React, {Component} from 'react'
import Layout from '../components/Layout'
import {serverSideProps} from '../utils/init'
import {AppContext} from 'next/app'

class Index extends Component {
    render() {
        return (
            <Layout {...this.props}>
                메인임
            </Layout>
        )
    }
}

export const getServerSideProps = serverSideProps

export default Index