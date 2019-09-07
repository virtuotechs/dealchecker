import React from 'react';
import Head from 'next/head';
import Header from './header';
import Footer from './footer';

const Layout = (props) => {

        return(
            <div>
                <Head>
                    <title>Deal Checker</title>
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"></meta>
                    <link rel="icon" href="../static/images/dc_fav-01.png" type="image/png" sizes="16x16"></link>
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" crossOrigin="anonymous"/>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" crossOrigin="anonymous"></link>
                    <link rel="stylesheet" href="../static/styles/styles.css"/>
                    <link rel="stylesheet" href="../static/styles/style.css"/>
                    <link rel="stylesheet" href="../static/styles/react-datepicker.css"/>
                    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js" crossOrigin="anonymous"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" crossOrigin="anonymous"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" crossOrigin="anonymous"></script>
                </Head>
                <Header/>
                {props.children}        
                <Footer/>
            </div>
        );
    }

export default Layout;