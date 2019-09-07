import React,{useEffect,useState,useContext} from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import Router from 'next/router';
import dateFormat from 'dateformat';
import { connect } from 'react-redux'
//Number Input
import NumericInput from 'react-numeric-input';
//Auto complete imports
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';

// Auto complete
const languages = require('../data/countries.json');
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function getSuggestions(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    return languages.filter(language => regex.test(language.CityName));
  }
  
  function getSuggestionValue(suggestion) {
    return `${suggestion.CityName} - ${suggestion.PlaceName} (${suggestion.PlaceId})`;
  }
  
  function renderSuggestion(suggestion, { query }) {
	const suggestionText = `${suggestion.CityName} - ${suggestion.PlaceName} (${suggestion.PlaceId})`;
	const suggestionCountry = `${suggestion.CountryId}`;
	const matches = AutosuggestHighlightMatch(suggestionText,query);
	const parts = AutosuggestHighlightParse(suggestionText, matches);
	return (
		<span className={'suggestion-content ' + suggestion.twitter}>
		  <span className="autocomplete-name">
		  <img className='fa fa-fighter-jet autocomplete-flight-img' alt="Flight" src='static/images/flight.png' width='25px'></img>
			{
			  parts.map((part, index) => {
				const className = part.highlight ? 'highlight' : null;
	
				return (
				  <span className={className} key={index}>{part.text}</span>
				);
			  })
			}
			<br/><small className="country-name">{suggestionCountry}</small>
		  </span>
		</span>
	  );
  }
  
  class MyAutosuggest extends React.Component {
    constructor() {
      super();
      this.state = {
        value: '',
        suggestions: []
      };    
    }
  
    onChange = (_, { newValue }) => {
      const { id, onChange } = this.props;
      this.setState({
        value: newValue
      });
      
      onChange(id, newValue);
    };
    
    onSuggestionsFetchRequested = ({ value }) => {
      this.setState({
        suggestions: getSuggestions(value)
      });
    };
  
    onSuggestionsClearRequested = () => {
      this.setState({
        suggestions: []
      });
    };
  
    render() {
      const { id, placeholder } = this.props;
	  const { value, suggestions } = this.state;
      const inputProps = {
        placeholder,
        value,
        onChange: this.onChange
      };
      
      return (		
        <Autosuggest 
          id={id}
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} 
        /> 
      );
    }
  }
  
// Index Page
const Home = (props) => {	


	//Number input ref
	const adultCountref = React.createRef();
	const childCountref = React.createRef();

	//states
	const [request,setRequest] = useState([]);
	const [showAnn,setShowAnn] = useState(false);
	const [round,setRound] = useState(true);
	const [oneway,setOneway] = useState(false);
	const [multi,setMulti] = useState(false); 
	const [searchType,setSearchtype] = useState(2);
	const [isDirectFlight,setDirectflight] = useState(false);
	const [departureLocationCode,setDeparturelocationcode] = useState('');
	const [arrivalLocationCode,setArrivallocationcode] = useState('');
	const [departureLocationName,setDepartureLocationName]= useState('');
	const [arrivalLocationName,setArrivalLocationName] = useState('');
	const [preferedFlightClass,setPreferedflightclass] = useState(1);
	const [departureDate,setDeparturedate] = useState(new Date());
	const [returnDate,setReturndate] = useState(new Date());
	const [adultCount,setAdultcount] = useState(1);
	const [childCount,setchildCount] = useState(0);
	const [departure_err,setDeparture_err] = useState(false);
	const [arrival_err,setArrival_err] = useState(false);
	const [cabin_err,setCabin_err] = useState(false);
	const [departureDate_err,setDeparturedate_err] = useState(false);
	const [returnDate_err,setReturndate_err] = useState(false);
	const [adults_err,setAdults_err] = useState(false);
	const [child_err,setChild_err] = useState(false);
	const [fetchLoading,setFetchLoading] = useState(false);

	const showAnother = (e) => {
		setShowAnn(true);
	}
	const handleround = (date) => {
		setRound(true);
		setOneway(false);
		setMulti(false);
		setSearchtype(2);
		
	}
	const handleoneway = (date) => {
		setRound(false);
		setOneway(true);
		setMulti(false);
		setSearchtype(1);
	}

	const handlemulti = (date) => {
		setRound(false);
		setOneway(false);
		setMulti(true);
		setSearchtype(3);
	}

	const handleendChange = (date) => {
		setReturndate(date);
	}

	const handlestartChange = (date) => {
		setDeparturedate(date);
	}

	const handleSelect = (selectedTab) => {
		setActiveTab(selectedTab);
	}
	const changedirectFlight = (e) => {
		setDirectflight(!isDirectFlight);
	}
	const changeDeparture = (e) => {
		setDeparturelocationcode(e.target.value);
		setDeparture_err(false);
	}
	const changeArrival = (e) => {
		setArrivallocationcode(e.target.value);
		setArrival_err(false);
	}
	const changeClass = (e) => {
		setPreferedflightclass(e.target.value);
		setCabin_err(false);
	}
	const adultChanged = (e) =>{
		if(e<=9)
		{
			setAdults_err(false);
			setAdultcount(e);
		}
		else
		{
			setAdults_err(true);
			setAdultcount(1);
		}
	}
	const childChanged = (e) =>{
		if(e<=9)
		{
			setChild_err(false);
			setchildCount(e);
		}
		else
		{
			setChild_err(true);
			setchildCount(0);
		}
		console.log("Child Count: ",childCount);
	}
	
	const flightsforRoundTrip = (e) => {
		e.preventDefault();
		if(adultCount < 1 || adultCount == null)
		{
			setAdults_err(!adults_err);
		}
		if(childCount < 0 || childCount == null)
		{
			setChild_err(!child_err);
		}
		if(departureLocationCode == "")	
		{
			setDeparture_err(!departure_err);
		}
		if(arrivalLocationCode == "")
		{
			setArrival_err(!arrival_err);
		}
		console.log("Departure date: ",dateFormat(departureDate, "dd-mm-yyyy"));
		console.log("Return date: ",dateFormat(returnDate, "dd-mm-yyyy"));
		console.log("Adult count: ",adultCount);
		console.log("child count",childCount);
		console.log("Location1: ",departureLocationCode);
		console.log("Location2: ",arrivalLocationCode);
		console.log("prefered class: ",preferedFlightClass);
		console.log("direct flight",isDirectFlight);
		console.log("search type: ",searchType);
		if(departureLocationCode != "" && arrivalLocationCode !="" && adultCount != null && childCount != null)
		{
			setFetchLoading(true);
			Router.push({
				pathname: '/ticketBooking',
				query: {
					"adultCount": adultCount,
					"childCount": childCount,
					"infantCount": "0",
					"isDirectFlight": isDirectFlight,
					"isPlusOrMinus3Days": "false",
					"searchType": searchType,
					"preferedFlightClass": preferedFlightClass,
					"departureLocationCode": departureLocationCode,
					"departureDate": dateFormat(departureDate, "dd-mm-yyyy"),
					"arrivalLocationCode": arrivalLocationCode,
					"returnDate": dateFormat(returnDate, "dd-mm-yyyy"),
					"departureTime": "Any",
					"returnTime": "Any",
					"PageIndex": "1",
					"PageSize": "50",
					"departureLocationName": departureLocationName,
					"arrivalLocationName": arrivalLocationName
					}
				}) 	
		}
	}
	const onChangeHome = (id, suggestion) => {
		if(id=="countries1")
		{		
			var suggestion = suggestion.trim();
			setDepartureLocationName(suggestion);
			var length = suggestion.length;
			var exact_match = suggestion.substring(length - 4, length-1);
			exact_match = exact_match.trim();
			setDeparturelocationcode(exact_match);
		}
		else if(id=="countries2")
		{
			var suggestion = suggestion.trim();
			setArrivalLocationName(suggestion);
			var length = suggestion.length;
			var exact_match = suggestion.substring(length - 4, length-1);
			exact_match = exact_match.trim();
			setArrivallocationcode(exact_match);
		}
	  }

		return (	
            <div>
				<section className="background">
					<Container>
						<div className="title">Discover</div>
						<h5 className="title_flight">
							<img className='flight_img' src='static/images/airplane-flight.svg' width='25' ></img> Flights
                        </h5>
						<div className="flight">
							<Form>
								<div className="mb-3">
									<Form.Check name="searchType" defaultValue="1" className='radio_btn' inline label="One Way" type="radio" defaultChecked={searchType == '1'} onClick={handleoneway} id={`inline-radio-2`} />
									<Form.Check name="searchType" defaultValue="2" className='radio_btn' inline label="Round Trip" defaultChecked={searchType == '2'} type="radio" onClick={handleround} id={`inline-radio-1`} />
									<Form.Check name="searchType" defaultValue="3" className='radio_btn' inline label="Multi-city" type="radio" defaultChecked={searchType == '3'} onClick={handlemulti} id={`inline-radio-3`} />
								</div>
									<div className='checkbox-custom'>
										<div className="mb-3 right">
											<Form.Check name="isDirectFlight" inline label="Direct Flight Only" type="checkbox" id={`inline-check-1`} defaultChecked={isDirectFlight} defaultValue={isDirectFlight} onClick={changedirectFlight}/>
										</div>
									</div>
								<Row hidden={!round}>
									<Col md={9} sm={12}>
										<Row>
											<Col md={6} sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>From</Form.Label>
													<div className="select_box1">
														<MyAutosuggest
														id="countries1"
														onChange={onChangeHome}
														/>
														{departure_err ? (<i className="err-msg">Departure Location required</i>): null}
													</div>
												</Form.Group>
												{['checkbox'].map(type => (
													<div key={`inline-${type}`} className='checkbox-custom'>
														<div  className="mb-3 top-0">
															<Form.Check name="add_near_airport" inline label="Add Nearby Airports" type={type} id={`inline-${type}-1`} />
														</div>
													</div>
												))}
											</Col>
											<Col md={6} sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>To</Form.Label>
													<div className="select_box1">
														<MyAutosuggest
														id="countries2"	
														onChange = {onChangeHome}													
														/>
														{arrival_err ? (<i className="err-msg">Arrival Location required</i>): null}
													</div>
												</Form.Group>
												{['checkbox'].map(type => (
													<div key={`inline-${type}`} className='checkbox-custom'>
														<div className="mb-3 top-0">
															<Form.Check name="add_near_airport" inline label="Add Nearby Airports" type={type} id={`inline-${type}-1`} />
														</div>
													</div>
												))}
											</Col>
										</Row>
									</Col>
									<Col md={3} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>Cabin Class</Form.Label>
											<div className="select_box">
												<Form.Control as="select" name="preferedFlightClass" onChange={changeClass}>
													<option value="1">Any</option>
													<option value="2">Business</option>
													<option value="3">Economy</option>
													<option value="4">First Class</option>
													<option value="5">PremiumOrEconomy</option>
													<option value="6">PremiumAndEconomy</option>
												</Form.Control>
												{cabin_err ? (<i className="err-msg">Cabin class is required</i>): null}
											</div>
										</Form.Group>
									</Col>

									<Col lg={5} md={12}>
										<Row>
										{/* static/images/calendar.svg */}
											<Col sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Departure</Form.Label>
													<div className="date">
														{/* <i className="fa fa-calendar"> </i>  */}
														<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
														<DatePicker 
														name="departureDate"
														className="form-control" 
														showMonthDropdown 
														showYearDropdown 
														dateFormat="dd/MM/yyyy" 
														selected={departureDate} 
														onChange={handlestartChange} />
														{departureDate_err ? (<i className="err-msg">Departure date is required</i>): null}
													</div>
												</Form.Group>
											</Col>
											<Col sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1s">
													<Form.Label>Return</Form.Label>
													<div className="date">
														{/* <i className="fa fa-calendar"> </i>  */}
														<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
														<DatePicker 
															name="returnDate" 
															className="form-control" 
															dateFormat="dd/MM/yyyy" 
															showMonthDropdown 
															showYearDropdown 
															selected={returnDate} 
															onChange={handleendChange}
															/>
															{returnDate_err ? (<i className="err-msg">Return date is required</i>): null}
													</div>
												</Form.Group>
											</Col>
										</Row>
									</Col>
									<Col lg={7} md={12}>
										<Row>
											<Col sm={3}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Adults (16+)</Form.Label>
													<div className="arrow">
														<NumericInput mobile name="adultCount" className="number-input form-control" value={adultCount} min={1} max={9} step={1} onChange={adultChanged}/>
														{adults_err ? (<i className="err-msg">Put value between 1-9</i>): null}
													</div>
												</Form.Group>
											</Col>
											<Col sm={3}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Children</Form.Label>
													<div className="arrow">
													<NumericInput mobile name="childCount" className="number-input form-control" value={childCount} min={0} max={9} step={1} onChange={childChanged}/>
													{child_err ? (<i className="err-msg">Put value between 1-9</i>): null}
													</div>
												</Form.Group>
											</Col>
											<Col sm={6}>
												{/* <a href='/ticketBooking'><Button className='form-control' variant="danger">SEARCH FLIGHTS</Button></a> */}
												{/* <Button className='form-control' variant="danger" type="submit">SEARCH FLIGHTS</Button> */}
												<Button className="form-control" variant="danger" onClick={flightsforRoundTrip} disabled={fetchLoading}>
												{fetchLoading && (
													<i
													className="fa fa-refresh fa-spin"
													style={{ marginRight: "5px" }}
													/>
												)}
												{fetchLoading && <span>Loading Data from Server</span>}
												{!fetchLoading && <span>SEARCH FLIGHTS</span>}
												</Button>
											</Col>
										</Row>
									</Col>
								</Row>
								<Row hidden={!oneway}>
									<Col md={9} sm={12}>
										<Row>
											<Col md={6} sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>From</Form.Label>
													<div className="select_box1">
														{/* <Autocomplete
														value={departureLocationCode}
														inputProps={{ id: 'states-autocomplete' }}
														items={departureData}
														getItemValue={ item => item.CityName }
														shouldItemRender={ matchStocks }
														onChange = { onChangeCountries}
														autoComplete="off"
														onSelect={ departureLocationCode => setDeparturelocationcode(departureLocationCode)}
														renderMenu={ children => (
															<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
														)}
														renderItem={(item, isHighlighted) => (
															<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
																<p>
																	<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
																	&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
																	({item.CityId})</big>
																	<br /><span>{item.CountryName}</span>
																</p>

															</div>
														)}
														/><br/> */}
														{departure_err ? (<i className="err-msg">Departure Location required</i>): null}
													</div>
												</Form.Group>
												{['checkbox'].map(type => (
													<div key={`inline-${type}`} className='checkbox-custom'>
														<div className="mb-3 top-0">
															<Form.Check name="add_near_airport" inline label="Add Nearby Airports" type={type} id={`inline-${type}-1`} />
														</div>
													</div>
												))}
											</Col>
											<Col md={6} sm={6}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>To</Form.Label>
													<div className="select_box1">
													{/* <Autocomplete
														value={ arrivalLocationCode }
														autoComplete="off"
														inputProps={{ id: 'states-autocomplete' }}
														items={arrivalData}
														getItemValue={ item => item.CityName }
														shouldItemRender={ matchStocks1 }
														onChange = {onChangeCountries1}
														onSelect={ arrivalLocationCode => setArrivallocationcode(arrivalLocationCode) }
														renderMenu={ children => (
															<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
														)}
														renderItem={(item, isHighlighted) => (
															<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
																<p>
																	<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
																	&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
																	({item.CityId})</big>
																	<br /><span>{item.CountryName}</span>
																</p>

															</div>
														)}
														/><br/> */}
														{arrival_err ? (<i className="err-msg">Arrival Location required</i>): null}
													</div>
												</Form.Group>
												{['checkbox'].map(type => (
													<div key={`inline-${type}`} className='checkbox-custom'>
														<div className="mb-3 top-0">
															<Form.Check name="add_near_airport" inline label="Add Nearby Airports" type={type} id={`inline-${type}-1`} />
														</div>
													</div>
												))}
											</Col>
										</Row>
									</Col>
									<Col md={3} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>Cabin Class</Form.Label>
											<div className="select_box">
												<Form.Control as="select" name="preferedFlightClass" onChange={changeClass}>
													<option value="1">Any</option>
													<option value="2">Business</option>
													<option value="3">Economy</option>
													<option value="4">First Class</option>
													<option value="5">PremiumOrEconomy</option>
													<option value="6">PremiumAndEconomy</option>
												</Form.Control>
											</div>
										</Form.Group>
									</Col>
									<Col lg={5} md={12}>
										<Row>
											<Col sm={12}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Depature</Form.Label>
													<div className="date">														
														<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
														<DatePicker 
														name="departureDate" 
														className="form-control" 
														showMonthDropdown 
														showYearDropdown 
														dateFormat="dd/MM/yyyy" 
														selected={departureDate} 
														onChange={handlestartChange} />
														{departureDate_err ? (<i className="err-msg">Departure date is required</i>): null}
													</div>
												</Form.Group>
											</Col>
										</Row>
									</Col>
									<Col lg={7} md={12}>
										<Row>
											<Col sm={3}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Adults (16+)</Form.Label>
													<div className="arrow">
														<div className="quantity">
														<input type="number" ref={adultCountref} name="adultCount" min="1" max="9" step="1" defaultValue={adultCount} className="form-control" onChange={adultChanged} readOnly/>
															{adults_err ? (<i className="err-msg">Adults counting atleast have 1</i>): null}

														</div>
													</div>
												</Form.Group>
											</Col>
											<Col sm={3}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Children</Form.Label>
													<div className="arrow">
														<div className="quantity">
														<input type="number" ref={childCountref} name="childCount" min="0" max="9" step="1" defaultValue={childCount} className="form-control" onChange={childChanged}/>
															{child_err ? (<i className="err-msg">Invalid counting</i>): null}                                                            
														</div>
													</div>
												</Form.Group>
											</Col>
											<Col sm={6}>
											<a href='/ticketBooking'><Button className='form-control' variant="danger">SEARCH FLIGHTS</Button></a>
											</Col>
										</Row>
									</Col>
								</Row> 

								<Row hidden={!multi}>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>From</Form.Label>
											<div className="select_box1">
											{/* <Autocomplete
												value={departureLocationCode}
												inputProps={{ id: 'states-autocomplete' }}
												items={departureData}
												getItemValue={ item => item.CityName }
												shouldItemRender={ matchStocks }
												onChange = { onChangeCountries}
												autoComplete="off"
												onSelect={ departureLocationCode => setDeparturelocationcode(departureLocationCode)}
												renderMenu={ children => (
													<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
												)}
												renderItem={(item, isHighlighted) => (
													<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
														<p>
															<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
															&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
															({item.CityId})</big>
															<br /><span>{item.CountryName}</span>
														</p>

													</div>
												)}
												/><br/> */}
												{departure_err ? (<i className="err-msg">Departure Location required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>To</Form.Label>
											<div className="select_box1">
											{/* <Autocomplete
												value={ arrivalLocationCode }
												autoComplete="off"
												inputProps={{ id: 'states-autocomplete' }}
												items={arrivalData}
												getItemValue={ item => item.CityName }
												shouldItemRender={ matchStocks1 }
												onChange = {onChangeCountries1}
												onSelect={ arrivalLocationCode => setArrivallocationcode(arrivalLocationCode) }
												renderMenu={ children => (
													<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
												)}
												renderItem={(item, isHighlighted) => (
													<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
														<p>
															<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
															&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
															({item.CityId})</big>
															<br /><span>{item.CountryName}</span>
														</p>

													</div>
												)}
												/><br/> */}
												{arrival_err ? (<i className="err-msg">Arrival Location required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>Depature</Form.Label>
											<div className="date">
												<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
												<DatePicker 
												name="departureDate" 
												className="form-control" 
												showMonthDropdown 
												showYearDropdown 
												dateFormat="dd/MM/yyyy" 
												selected={departureDate} 
												onChange={handlestartChange} />
												{departureDate_err ? (<i className="err-msg">Departure date is required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>From</Form.Label>
											<div className="select_box1">
											{/* <Autocomplete
												value={departureLocationCode}
												inputProps={{ id: 'states-autocomplete' }}
												items={departureData}
												getItemValue={ item => item.CityName }
												shouldItemRender={ matchStocks }
												onChange = { onChangeCountries}
												autoComplete="off"
												onSelect={ departureLocationCode => setDeparturelocationcode(departureLocationCode)}
												renderMenu={ children => (
													<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
												)}
												renderItem={(item, isHighlighted) => (
													<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
														<p>
															<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
															&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
															({item.CityId})</big>
															<br /><span>{item.CountryName}</span>
														</p>

													</div>
												)}
												/><br/> */}
												{departure_err ? (<i className="err-msg">Departure Location required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>To</Form.Label>
											<div className="select_box1">
											{/* <Autocomplete
												value={ arrivalLocationCode }
												autoComplete="off"
												inputProps={{ id: 'states-autocomplete' }}
												items={arrivalData}
												getItemValue={ item => item.CityName }
												shouldItemRender={ matchStocks1 }
												onChange = {onChangeCountries1}
												onSelect={ arrivalLocationCode => setArrivallocationcode(arrivalLocationCode) }
												renderMenu={ children => (
													<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
												)}
												renderItem={(item, isHighlighted) => (
													<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
														<p>
															<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
															&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
															({item.CityId})</big>
															<br /><span>{item.CountryName}</span>
														</p>

													</div>
												)}
												/><br/> */}
												{arrival_err ? (<i className="err-msg">Arrival Location required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<Col md={4} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>Depature</Form.Label>
											<div className="date">
												<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
												<DatePicker 
												name="departureDate" 
												className="form-control" 
												showMonthDropdown 
												showYearDropdown 
												dateFormat="dd/MM/yyyy" 
												selected={departureDate} 
												onChange={handlestartChange} />
												{departureDate_err ? (<i className="err-msg">Departure date is required</i>): null}
											</div>
										</Form.Group>
									</Col>
									<div hidden={!showAnn} style={{width: '100%'}}>
										<Row style={{padding: '0 15px'}}>
											<Col md={4} sm={12}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>From</Form.Label>
													<div className="select_box1">
													{/* <Autocomplete
													value={departureLocationCode}
													inputProps={{ id: 'states-autocomplete' }}
													items={departureData}
													getItemValue={ item => item.CityName }
													shouldItemRender={ matchStocks }
													onChange = { onChangeCountries}
													autoComplete="off"
													onSelect={ departureLocationCode => setDeparturelocationcode(departureLocationCode)}
													renderMenu={ children => (
														<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
													)}
													renderItem={(item, isHighlighted) => (
														<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
															<p>
																<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
																&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
																({item.CityId})</big>
																<br /><span>{item.CountryName}</span>
															</p>

														</div>
													)}
													/><br/> */}
													{departure_err ? (<i className="err-msg">Departure Location required</i>): null}
													</div>
												</Form.Group>
											</Col>
											<Col md={4} sm={12}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>To</Form.Label>
													<div className="select_box1">
													{/* <Autocomplete
														value={ arrivalLocationCode }
														autoComplete="off"
														inputProps={{ id: 'states-autocomplete' }}
														items={arrivalData}
														getItemValue={ item => item.CityName }
														shouldItemRender={ matchStocks1 }
														onChange = {onChangeCountries1}
														onSelect={ arrivalLocationCode => setArrivallocationcode(arrivalLocationCode) }
														renderMenu={ children => (
															<div><div className = "menu">
																{ children }
															</div>
															<div id="pointer"></div></div>
														)}
														renderItem={(item, isHighlighted) => (
															<div className={`item ${isHighlighted ? 'item-highlighted' : ''}`} key={item.CityName} >
																<p>
																	<img className='fa fa-fighter-jet' alt="Flight" src='static/images/flight.png' width='25px'></img>
																	&nbsp;&nbsp;<big>{item.CityName}&nbsp;&nbsp;
																	({item.CityId})</big>
																	<br /><span>{item.CountryName}</span>
																</p>

															</div>
														)}
														/><br/> */}
														{arrival_err ? (<i className="err-msg">Arrival Location required</i>): null}
													</div>
												</Form.Group>
											</Col>
											<Col md={4} sm={12}>
											<Form.Group controlId="exampleForm.ControlSelect1">
												<Form.Label>Depature</Form.Label>
												<div className="date">
													<img className='fa fa-calendar' src='static/images/calendar.svg' width='25'></img>
													<DatePicker 
													name="departureDate" 
													className="form-control" 
													showMonthDropdown 
													showYearDropdown 
													dateFormat="dd/MM/yyyy" 
													selected={departureDate} 
													onChange={handlestartChange} />
													{departureDate_err ? (<i className="err-msg">Departure date is required</i>): null}
												</div>
											</Form.Group>
										</Col>
										</Row>
									</div>
									<Col md={4} sm={12}>
										<Button className='form-control' variant="danger" onClick={showAnother}>ADD ANOTHER FLIGHT</Button>
									</Col>
									<Col md={8} sm={12}>

									</Col>
									<Col md={3} sm={12}>
										<Form.Group controlId="exampleForm.ControlSelect1">
											<Form.Label>Cabin Class</Form.Label>
											<div className="select_box">
												<Form.Control as="select" name="preferedFlightClass" onChange={changeClass}>
													<option value="0" hidden>Select</option>
													<option value="1">Any</option>
													<option value="2">Business</option>
													<option value="3">Economy</option>
													<option value="4">First Class</option>
													<option value="5">PremiumOrEconomy</option>
													<option value="6">PremiumAndEconomy</option>
												</Form.Control>
											</div>
										</Form.Group>
									</Col>
									<Col md={9} sm={12}>
										<Row>
											<Col sm={4}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Adults (16+)</Form.Label>
													<div className="arrow">
														<div className="quantity">
														<input type="number" ref={adultCountref} name="adultCount" min="1" max="9" step="1" defaultValue={adultCount} className="form-control" onChange={adultChanged} readOnly/>
															{adults_err ? (<i className="err-msg">Adults counting atleast have 1</i>): null}
														</div>
													</div>
												</Form.Group>
											</Col>
											<Col sm={4}>
												<Form.Group controlId="exampleForm.ControlSelect1">
													<Form.Label>Children</Form.Label>
													<div className="arrow">
														<div className="quantity">
														<input type="number" ref={childCountref} name="childCount" min="0" max="9" step="1" defaultValue={childCount} className="form-control" onChange={childChanged}/>
															{child_err ? (<i className="err-msg">Invalid counting</i>): null}                                                            
														</div>
													</div>
												</Form.Group>
											</Col>
											<Col sm={4}>
											<a href='/ticketBooking'><Button className='form-control' variant="danger">SEARCH FLIGHTS</Button></a>
											</Col>
										</Row> 
									</Col>
								</Row>
							</Form>
						</div>
					</Container>
				</section>

				{/* Next Section */}
				<section className='nextBG'>
					<Container>
						<div className=''>
							<Row>
								<Col md={1} sm={12}>
								</Col>
								<Col md={10} sm={12}>
									<Row>
										<Col xl={3} lg={6} md={6} sm={6} xs={6} className='service'>
											<div className='img_round'>
												<div className='count'>01</div>
												<img src='static/images/image02.jpg' width='100%' alt=''></img>
											</div>
											<h5>BEST PRICE GUARANTEE</h5>
											<p>" Offical ticket agent. No refund, ticket renewed. "</p>
										</Col>
										<Col xl={3} lg={6} md={6} sm={6} xs={6} className='service'>
											<div className='count'>02</div>
											<div className='img_round'>
												<img src='static/images/image01.jpg' width='100%' alt=''></img>
											</div>
											<h5>PLEASE FLIGHT TICKET</h5>
											<p>" Convenient payment and very safe, intelligent booking system. " </p>
										</Col>
										<Col xl={3} lg={6} md={6} sm={6} xs={6} className='service'>
											<div className='img_round'>
												<div className='count'>03</div>
												<img src='static/images/image03.jpg' width='100%' alt=''></img>
											</div>
											<h5>CUSTOMER CARE 24/7</h5>
											<p>" Cheap Domestic Flights, International Cheap Flights. "</p>
										</Col>
										<Col xl={3} lg={6} md={6} sm={6} xs={6} className='service'>
											<div className='img_round'>
												<div className='count'>04</div>
												<img src='static/images/image04.jpg' width='100%' alt=''></img>
											</div>
											<h5>THOUGHTFUL SERVICE</h5>
											<p>" Support Free Support Related Information. "</p>
										</Col>
									</Row>
								</Col>
								<Col md={1} sm={12}>
								</Col>
							</Row>
						</div>
					</Container>
				</section>
			</div>
		);
	}
export default Home;