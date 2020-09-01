import App from 'next/app'
import Head from 'next/head'
import React from 'react'
import NextNProgress from 'nextjs-progressbar'
import '../typings'
import '../styles/styles.css'
import 'react-awesome-slider/dist/styles.css'
import 'react-awesome-slider/dist/custom-animations/fall-animation.css'

export default class RootApp extends App {
    render(): JSX.Element {
        return (
            <>
                <Head>
                    <title>DOSBOT</title>
                </Head>
                <NextNProgress color="#fff"/>
                <this.props.Component {...this.props}/>
            </>
        )
    }
}

