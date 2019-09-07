import React, { Component } from 'react';
import Link from 'next/link';
import { Row, Col, Nav, Container } from 'react-bootstrap';

class Header extends Component {

    constructor() {
        super();
        this.state = {
            hidenav: false
        }

        this.closeNav = this.closeNav.bind(this);
        this.openNav = this.openNav.bind(this);
    }

    closeNav() {
        setTimeout(
            function () {
                this.setState({
                    hidenav: true
                });
            }
                .bind(this), 300);
    }

    openNav() {
        setTimeout(
            function () {
                this.setState({
                    hidenav: false
                });
            }
                .bind(this), 3000);
    }

    render() {
        return (
            <div>
                <Nav className="navbar  navbar-expand-lg navbar-dark top-navbar" data-toggle="sticky-onscroll">
                    <Container>
                        <div id="mySidenav" className="sidenav">
                            <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav}>&times;</a>
                            <a href="#">About</a>
                            <a href="#">Services</a>
                            <a href="#">Clients</a>
                            <a href="#">Contact</a>
                        </div>

                        <div className="d_flex">
                            <div className="main">
                                <img className="toggle_menu" src="static/images/menuicon.svg" width="24" onClick={this.openNav} />
                            </div>

                            <Row>
                                <Col xs={3} className="text-left">
                                    {/* <Link href='/'>
                                        <div className="logo"><img src="static/images/dc_fav-01.png"></img></div>
                                    </Link> */}
                                    <Link href='/'><img src='static/images/dealchecker.svg'></img></Link>
                                </Col>
                                <Col xs={9} className="text-right">
                                    <div className="callus">
                                        Call Us: 0123 456 789
                                    </div>

                                    <div className="help">
                                        Help ?
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Container>
                </Nav>
            </div>
        );
    }

}

export default Header;