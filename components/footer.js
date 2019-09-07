import React, { Component } from 'react';
import Link from 'next/link';
import { Row, Col, Nav, Container, Form, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";

class Footer extends Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<section className='footer'>
					<Container>
						<Row>
							<Col md={5} sm={12}>
							<Link href='/'><img src='static/images/dealchecker.svg' style={{height:'45px',width:'235px'}}></img></Link>
								<p className='address'><b>A:</b> Addressline1Addressline1Addressline1<br></br>
								<b>P:</b> 24/7 Customer Support: 1-222-2222-22-22<br></br>
								<b>E:</b> info@dealchecker.com</p>
								<h6><b>Follow us:</b></h6>
								<div className='social-media'>
									<div className='twitter'>
										<img src='static/images/twitter.svg' alt='' width='32'></img>
									</div>
									<div className='twitter'>
										<img src='static/images/fb.svg' alt='' width='32'></img>
									</div>
									<div className='twitter'>
										<img src='static/images/insta.svg' alt='' width='32'></img>
									</div>
									<div className='twitter'>
										<img src='static/images/pint.svg' alt='' width='32'></img>
									</div>
									<div className='twitter'>
										<img src='static/images/youtube.svg' alt='' width='32'></img>
									</div>
								</div>
							</Col>
							<Col md={7} sm={12}>
								<Row>
									<Col md={6} sm={6}>
										<h6><b>CUSTOMER SUPPORT</b></h6>
										<ul>
											<li>FAQ</li>
											<li>How do I make a reservation?</li>
											<li>Booking Tips</li>
											<li>Contact Us</li>
										</ul>
									</Col>
									<Col md={6} sm={6}>
										<h6><b>GET YOUR OFFERS</b></h6>
										<Form>
											<Form.Group controlId="formBasicEmail">
												<Form.Control className='inp_mail' type="email" placeholder="Enter Your Email" />
												<div className='e_mail'>
													<img src='static/images/maill_send.svg' alt='' width='35'></img>
												</div>
											</Form.Group>
										</Form>
										<p className='f_para'>We guarantee your confidentiality, and we also undertake not to transfer your email address to third parties.</p>
									</Col>
								</Row>
							</Col>
						</Row>
					</Container>
				</section>
			</div>
		);
	}

}

export default Footer;