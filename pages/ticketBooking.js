import React, { useState,useEffect } from 'react';
import Layout from '../components/layout';
import { Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import sortJsonArray from 'sort-json-array';
import ReactTooltip from 'react-tooltip';
import dateFormat from 'dateformat';
import getSymbolFromCurrency from 'currency-symbol-map'
import datetimeDifference from "datetime-difference";
import { connect } from 'react-redux';
import axios from 'axios';
import 'isomorphic-fetch';
import {getFlights} from '../api';
import Router from 'next/router';

//Auto complete imports
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import Link from 'next/link';

// Auto complete
const languages = require('../data/countries.json');
function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  function getSuggestions(value) {
    console.log("Get suggestions",value);
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }
  
    const regex = new RegExp('^' + escapedValue, 'i');
  
    return languages.filter(language => regex.test(language.CityName));
  }
  
  function getSuggestionValue(suggestion) {
    console.log("Get suggestions value",suggestion);
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
    constructor(props) {
      super(props);
      this.state = {
        value: this.props.value,
        suggestions: ["name"]
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
        console.log("fetch requetsed",value);
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

const TicketBooking = (flights) => {

            console.log("Flights: ",flights.flights.data);
            console.log("REquest: ",flights.request);
            const changeMonthDate = (dt) => {
                var date1 = dt.split('-')
                var newDate = date1[1] + '-' + date1[0] + '-' + date1[2];
                var date = new Date(newDate);
                return (date);
               // console.log(date);
            }
            // State initialisation
            const [requestData,setRequestData] = useState(flights.request);
            const [jsondata,setJsondata] = useState(flights.flights.data);    
            const [startDate,setStartDate] =useState(changeMonthDate(requestData.segments[0].departureDate));
            const [endDate,setEndDate] = useState(changeMonthDate(requestData.segments[0].returnDate));
            const [sourcePlace,setSourcePlace]=useState(requestData.departureLocationName);
            const [destinationPlace,setDestinationPlace]=useState(requestData.arrivalLocationName);
            const [sortToggler,setSortToggler]=useState(false);
            const [filterToggler,setFilterToggler]=useState(false);
            const [sortOption,setSortOption]=useState('Best');
            console.log(new Date(requestData.segments[0].departureDate));
            const handleChange = (date) => {
                setStartDate(date);
            }
            const handleChange1 = (date) => {
                setEndDate(date);
            }
            const changePlace = (e) => {
            setSourcePlace(destinationPlace);
            setDestinationPlace(sourcePlace);
            }

            // const changeMonthDate = (dt) => {
            //     var date1 = dt.split('-')
            //     var newDate = date1[1] + '-' + date1[0] + '-' + date1[2];
            //     var date = new Date(newDate);
            //    // return (date);
            //     console.log(date);
            // }

            const TimeSplit = (time) => {
                time = time.replace(/(..?)/g, '$1:').slice(0, -1)
                return (time);
            }

            const handlesortToggler = () => {
                setSortToggler(true);
                setFilterToggler(false);
            }

            const handleFilterToggler = () => {
                setFilterToggler(true);
                setSortToggler(false);
            }

            const handleScrollToElement = (event) => {        
                $(window).scroll(function () {
                    var sticky = $('.filtering-row.row'),
                        scroll = $(window).scrollTop();

                    if (scroll >= 400) sticky.addClass('fixed');
                    else sticky.removeClass('fixed');
                });
            }

            const StopName = (stop) => {
                if(stop == 0)
                {
                    return "Non-stop";
                }
                else if(stop == 1)  
                {
                    return "1 stop";
                }
                else if(stop == 2)
                {
                    return "2 stops";
                }
            }
            const StopClassName = (stop) => {
                if(stop == 1)  
                {
                    return "onestop";
                }
                else if(stop == 2)
                {
                    return "twostop";
                }
            }
            const CalculateDuration = (duration) => {
                duration = TimeSplit(duration);
                var duration1 = duration.split(":");
                var duration_str = duration1[0]+"h "+duration1[1]+"m";
                return duration_str;
            }

            const ViaCityName = (cityname) => {
                cityname = cityname.split("(");
                return cityname[0];
            }
        const fastestDuration = () =>
        {
            var fastest_duration = Math.min.apply(Math,jsondata.recommendation.map(function (o) { return o.flightLeg[0].flightDetails.totalFlyingHours; }))
            console.log(fastest_duration);
            return CalculateDuration(fastest_duration.toString());
            
        }
        const fastestPrice = () =>
        {
            var fastest_duration = Math.min.apply(Math,jsondata.recommendation.map(function (o) { return o.flightLeg[0].flightDetails.totalFlyingHours; })) 
            var fastest_price =  jsondata.recommendation.filter(function(price) { return price.flightLeg[0].flightDetails.totalFlyingHours == fastest_duration});
            fastest_price = fastest_price[0].totalFare;
            return fastest_price;
        }
        const cheapestDuration = () =>
        {
            console.log("Cheapest: ",jsondata);
            var cheapest_price = Math.min.apply(Math,jsondata.recommendation.map(function (o) { return o.totalFare;}))
            var cheapest_duration =  jsondata.recommendation.filter(function(price) { return price.totalFare == cheapest_price});
            cheapest_duration = cheapest_duration[0].flightLeg[0].flightDetails.totalFlyingHours;
            return CalculateDuration(cheapest_duration);
        }
        const cheapestPrice = () =>
        {
            var cheapest_price = Math.min.apply(Math,jsondata.recommendation.map(function (o) { return o.totalFare;}))
            return cheapest_price;
        }
        const bestDuration = () =>
        {
        var best_price = jsondata.recommendation.sort(function(obj1, obj2) {
            return obj1.totalFare - obj2.totalFare && obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
        });
        return CalculateDuration(best_price[0].flightLeg[0].flightDetails.totalFlyingHours);
        }
        const bestPrice = () =>
        {
        var best_price = jsondata.recommendation.sort(function(obj1, obj2) {
            return obj1.totalFare - obj2.totalFare && obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
        });
        return best_price[0].totalFare;
        }
        useEffect(() => {
                window.addEventListener('scroll', handleScrollToElement);
            });
        const showFlightDetails = (id) =>
        {
            console.log("working");
            
            Router.push({
				pathname: '/ticketdetails',
				query: {
                    "id":id,
					"adultCount": requestData.adultCount,
					"childCount": requestData.childCount,
					"infantCount": requestData.infantCount,
					"isDirectFlight": requestData.isDirectFlight,
					"isPlusOrMinus3Days": requestData.isPlusOrMinus3Days,
					"searchType": requestData.searchType,
					"preferedFlightClass": requestData.preferedFlightClass,
					"departureLocationCode": requestData.segments[0].departureLocationCode,
					"departureDate": requestData.segments[0].departureDate,
					"arrivalLocationCode": requestData.segments[0].arrivalLocationCode,
					"returnDate": requestData.segments[0].returnDate,
					"departureTime": requestData.segments[0].departureTime,
					"returnTime": requestData.segments[0].returnTime,
					"PageIndex": "1",
					"PageSize": "50",
					"departureLocationName": requestData.departureLocationName,
					"arrivalLocationName": requestData.arrivalLocationName
					}
				}) 	
        }
            const handleSortOptions = (e) => {  
                setSortOption(e.target.value);
                if(e.target.value === "Best")
                {   
                    setJsondata(jsondata.recommendation.sort(function(obj1, obj2) {
                        return obj1.totalFare - obj2.totalFare && obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
                    }));
                }
                else if(e.target.value === "Cheapest First")
                {
                    setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                        return obj1.totalFare - obj2.totalFare;
                        }));
                }
                else if(e.target.value === "Fastest First")
                {
                    setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                        return obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
                        }));
                }
                else if(e.target.value === "Outbound: Departure Time")
                {
                    setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                        return obj1.flightLeg[0].flightDetails.departureTime - obj2.flightLeg[0].flightDetails.departureTime;
                    }));
                }
                else if(e.target.value === "Airline")
                {
                    
                    setJsondata(sortJsonArray(jsondata.recommendation, "marketingAirlineNames", "asc"));
                }
                else if(e.target.value === "Stops")
                {
                    setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                        return obj1.flightLeg[0].flightDetails.stopOvers - obj2.flightLeg[0].flightDetails.stopOvers;
                    }));
                }
            }
            const handleSortBest = (e) => {
                setSortOption("Best");
                setJsondata(jsondata.recommendation.sort(function(obj1, obj2) {
                    return obj1.totalFare - obj2.totalFare && obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
                }));
            }
            const handleSortCheapest = (e) => {
                setSortOption("Cheapest First");
                setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                    return obj1.totalFare - obj2.totalFare;
                    }));
            }
            const handleSortFastest = (e) => {
                setSortOption("Fastest First");
                setJsondata(jsondata.recommendation.sort(function (obj1, obj2) {
                    return obj1.flightLeg[0].flightDetails.totalFlyingHours - obj2.flightLeg[0].flightDetails.totalFlyingHours;
                    }));
            }
            const filtercname = (text) => {
                var filter_text = text.trim();
                filter_text = filter_text.split("-");
                return filter_text[0];
            }
            const preferedclassname = (classname) => {
                if(classname == "1")
                {
                    return "Any";
                }
                else if(classname == "2")
                {
                    return "Business";
                }
                else if(classname == "3")
                {
                    return "Economy";
                }
                else if(classname == "4")
                {
                    return "First Class";
                }
                else if(classname == "5")
                {
                    return "PremiumOrEconomy";
                }
                else if(classname == "6")
                {
                    return "PremiumAndEconomy";
                }
            }
            const nonstopFlights = () => {
                console.log("working");
                console.log(jsondata);
                console.log(jsondata.recommendation.filter(newdata => newdata.flightLeg[0].flightDetails.stopOvers == 0));
                console.log(jsondata);
            }
            const onChangeHome = (id, suggestion,value) => {
            console.log("onahnbeg vaue: ",value);
                if(id=="countries1")
                {		
                    var suggestion = suggestion.trim();
                    // setDepartureLocationName(suggestion);
                    var length = suggestion.length;
                    var exact_match = suggestion.substring(length - 4, length-1);
                    exact_match = exact_match.trim();
                    // setDeparturelocationcode(exact_match);
                }
                else if(id=="countries2")
                {
                    var suggestion = suggestion.trim();
                    // setArrivalLocationName(suggestion);
                    var length = suggestion.length;
                    var exact_match = suggestion.substring(length - 4, length-1);
                    exact_match = exact_match.trim();
                    // setArrivallocationcode(exact_match);
                }
            } 
            var currencyCode = jsondata.currencyCode;
            var total_response = jsondata.recommendation.length;
            
            return (
            <Layout>
                <div className="container-fluid">
                    <div className="bg-img">
                        <Row className="margin-0">
                            <Col sm={12} style={{ padding: '0' }}>
                                <div className="passanger-details">
                                    <Row>
                                        <Col xl={3} lg={4} md={6} sm={8} xs={9} className='pad-6'>
                                            <Row>
                                                <Col sm={5} xs={5}>
                                                    <div className='passanger-class'>
                                                        <small className="pink-text absl-text">TRIP TYPE</small>
                                                        <Form.Control className='trip_select' as="select" defaultValue={requestData.searchType}>
                                                            <option value="1">One Way</option>
                                                            <option value="2">Round Trip</option>
                                                            <option value="3">Multi-city</option>
                                                        </Form.Control>
                                                        <i className="fa fa-sort-desc" aria-hidden="true"></i>
                                                    </div>
                                                </Col>
                                                <Col sm={7} xs={7}>
                                                    <div className="passanger-class">
                                                        <small className="pink-text absl-text">Passanger & Class</small>
                                                        <p>{requestData.adultCount} Adult, {preferedclassname(requestData.preferedFlightClass)}
                                                        {/* {this.props.userAgent} */}
                                                        </p>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xl={9} lg={8} md={6} sm={4} xs={3} className='pad-6'>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col sm={12} md={12} lg={6}>
                                            <Row>
                                                <Col md={6} sm={6} xs={12} className='pad-6'>
                                                    <Form.Group className='auto_countries'>
                                                        <InputGroup>
                                                            <InputGroup.Prepend>
                                                                <InputGroup.Text id="inputGroupPrepend" className="bluebg-igroup"><i className="fa fa-map-marker" aria-hidden="true"></i></InputGroup.Text>
                                                            </InputGroup.Prepend>
                                                                <MyAutosuggest id="countries1" onChange={onChangeHome} value={requestData.departureLocationName}/>
                                                        </InputGroup>
                                                    </Form.Group>
                                                    <i className="fa fa-exchange" aria-hidden="true" onClick={changePlace}></i>
                                                </Col>
                                                <Col md={6} sm={6} xs={12} className='pad-6'>
                                                <Form.Group className='auto_countries'>
                                                    <InputGroup>
                                                        <InputGroup.Prepend>
                                                            <InputGroup.Text id="inputGroupPrepend" className="bluebg-igroup"><i className="fa fa-map-marker" aria-hidden="true"></i></InputGroup.Text>
                                                        </InputGroup.Prepend>
                                                            <MyAutosuggest id="countries2" onChange={onChangeHome} value={requestData.arrivalLocationName   }/>
                                                    </InputGroup>
                                                </Form.Group>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col sm={12} md={12} lg={6} className="padding-col">
                                            <Row>
                                                <Col lg={8} md={8} sm={9} xs={12} className='pad-6'>
                                                    <div className='dis_flex'>
                                                        <div className="calendar">
                                                            <img className="img_calendar" src="static/images/calendar.svg" width='25'></img>
                                                            <DatePicker
                                                                name="departureDate"
                                                                className="form-control"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dateFormat="eee, MMM d"
                                                                selected={startDate}
                                                                onChange={handleChange} />
                                                            {/* <i className="fa fa-angle-left" aria-hidden="true"></i>
                                                            <i className="fa fa-angle-right" aria-hidden="true"></i>&nbsp; */}
                                                            <span className='separt'> | </span>
                                                        </div>
                                                        <div className='calendar'>
                                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<DatePicker
                                                                name="departureDate"
                                                                className="form-control"
                                                                showMonthDropdown
                                                                showYearDropdown
                                                                dateFormat="eee, MMM d"
                                                                selected={endDate}
                                                                onChange={handleChange1} />
                                                            {/* <i className="fa fa-angle-left" aria-hidden="true"></i>
                                                            <i className="fa fa-angle-right" aria-hidden="true"></i> */}
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg={4} md={4} sm={3} xs={12} className='pad-6'>
                                                    <button className="btn-search">SEARCH</button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Filtering component */}
                    <div className="mobile-filterscreen">
                        <div className="visible-xs filter-mobile">
                            <Row className="filtering-row">
                                <Col sm={6} xs={6} lg={6} style={{ borderRight: '1px solid #FF4057' }}>
                                    <span onClick={handlesortToggler} className="mob-togglehead">Sort </span>
                                </Col>
                                <Col sm={6} xs={6} lg={6}>
                                    <span onClick={handleFilterToggler} className="mob-togglehead">Filter </span>
                                </Col>
                            </Row>
                            <div style={{ position: 'relative' }} hidden={!sortToggler}>
                                <Row className='sort'>
                                    <Col md={12} xs={12}>
                                        <p>
                                            <span className="bold-text" style={{ fontSize: '13px' }}>Sort by:</span>
                                            <Button variant="outline-danger" style={{ float: 'right' }} onClick={() => this.setState({ sortToggler: false, filterToggler: false })}>Close</Button>
                                        </p>
                                        <ul className="mobile-sortlist">
                                            <li>
                                                <span>
                                                    <input className='sort_name' type="radio" name="mobile_sorting" defaultValue="Popularity" /> Popularity
                                                </span>
                                            </li>
                                            <li>
                                                <span>
                                                    <input className='sort_name' type="radio" name="mobile_sorting" defaultValue="Duration" /> Duration
                                                </span>
                                            </li>
                                            <li>
                                                <span>
                                                    <input className='sort_name' type="radio" name="mobile_sorting" defaultValue="Price" /> Price
                                                </span>
                                            </li>
                                        </ul>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        {filterToggler ?
                        <div className="datas">
                            <Row>
                                <Col xs={12}>
                                    <p>
                                        <span className="bold-text">Filter by:</span>
                                        <Button variant="outline-danger" style={{ float: 'right' }} onClick={() => { setSortToggler(false); setFilterToggler(false);setFilterToggler(false); }}>Done</Button>
                                    </p>
                                    <br/>
                                    <Row>
                                        <Col xs={12}>
                                            <p className='small_txt'>
                                                <b>Stops</b>
                                                {/* <small className="pink-text" style={{ float: 'right' }}>Reset</small> */}
                                            </p>
                                            <Row>
                                                <Col xs={12}>
                                                    <div className='checkbox-custom'>
                                                        <Form.Check type="checkbox" label="Non-stop" name="stop1" value="Non-stop"/>
                                                        <Form.Check type="checkbox" label="1stop" name="stop2" value="1stop" />
                                                        <Form.Check type="checkbox" label="2 Stops" name="stop3" value="2stops" />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12}>
                                            <p className='small_txt'>
                                                <b>Departure from <span className="filter-cname">{filtercname(requestData.departureLocationName)}</span></b> 
                                                {/* <small className="pink-text" style={{ float: 'right' }}>Reset</small> */}
                                            </p> 
                                            <Row>
                                                <Col xs={12}>
                                                    <div className='checkbox-custom'>
                                                        <Form.Check type="checkbox" label="6AM - 12 Noon" />
                                                        <Form.Check type="checkbox" label="After 6PM" />
                                                        <Form.Check type="checkbox" label="12 Noon - 6PM" />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col xs={12}>
                                            <p className='small_txt'>
                                                <b>Departure from <span className="filter-cname">{filtercname(requestData.arrivalLocationName)}</span></b>
                                                {/* <small className="pink-text" style={{ float: 'right' }}>Reset</small> */}
                                            </p>
                                            <Row>
                                                <Col xs={12}>
                                                    <div className='checkbox-custom'>
                                                        <Form.Check type="checkbox" label="6AM - 12 Noon" />
                                                        <Form.Check type="checkbox" label="After 6PM" />
                                                        <Form.Check type="checkbox" label="12 Noon - 6PM" />
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={12}>
                                    <Row>
                                        <Col xs={12}>
                                            <p className='small_txt'>
                                                <b>Airlines</b>
                                            </p>
                                        </Col>
                                        <Col xs={12}>
                                            <Row>
                                                <Col xs={12}>
                                                    <div className='checkbox-custom'>
                                                        <Form.Check type="checkbox" label="Aer Lingus(2) 103,931" />
                                                        <Form.Check type="checkbox" label="Alitalia(6) 86,227" />
                                                        <Form.Check type="checkbox" label="Aer Finance(2) 103,931" />
                                                        <Form.Check type="checkbox" label="American Airlines,102,750" />
                                                    </div>
                                                </Col>
                                                {/* <Col xs={12}>
                                                    <small className="pink-text" style={{ float: 'left', marginTop: '20px' }}>More Filters</small>
                                                </Col> */}
                                            </Row>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div> : null}
                    </div>
                    {/* ---------------- end for mobile ---------------- */}

                    {/* ----------- Desktop Filters, Datas and Ad.. -----------  */}
                    {/* ---------------- Desktop Filter Datas ---------------- */}
                    <div className='filter-data'>
                        <div className = 'container-fluid'>
                            <Row>
                                <Col sm={12} md={12} lg={10} xl={10}>
                                    <Row>
                                        {/* Filter Datas */}
                                        <Col sm={12} md={3} className="hidden-xs">
                                            <div className='filter_Set'>
                                                <p className='small_txt'>
                                                    <b>Stops</b>
                                                    <small className="pink-text" style={{ float: 'right' }}>
                                                        {/* <i className="fa fa-angle-down" aria-hidden="true" ></i> */}

                                                    </small>
                                                </p>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='checkbox-custom'>
                                                            <Form.Check type="checkbox" label="Non-stop" name="stop1" value="Non-stop"  onClick={nonstopFlights} />
                                                            <Form.Check type="checkbox" label="1 Stop" name="stop2" value="1stop" />
                                                            <Form.Check type="checkbox" label="2 Stops" name="stop3" value="2stops" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className='filter_Set'>
                                                <p className='small_txt'>
                                                    <b>Departure from <span className="filter-cname">{filtercname(requestData.departureLocationName)}</span></b> 
                                                    <small className="pink-text" style={{ float: 'right' }}>
                                                    {/* <i className="fa fa-angle-down" aria-hidden="true" ></i> */}
                                                    </small>
                                                </p>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='checkbox-custom'>
                                                            <Form.Check type="checkbox" label="6 AM - 12 Noon" />
                                                            <Form.Check type="checkbox" label="After 6 PM" />
                                                            <Form.Check type="checkbox" label="12 Noon - 6 PM" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className='filter_Set'>
                                                <p className='small_txt'>
                                                    <b>Departure from <span className="filter-cname">{filtercname(requestData.arrivalLocationName)}</span></b>
                                                    <small className="pink-text" style={{ float: 'right' }}>
                                                    {/* <i className="fa fa-angle-down" aria-hidden="true" ></i> */}
                                                    </small>
                                                </p>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='checkbox-custom'>
                                                            <Form.Check type="checkbox" label="6 AM - 12 Noon" />
                                                            <Form.Check type="checkbox" label="After 6 PM" />
                                                            <Form.Check type="checkbox" label="12 Noon - 6 PM" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div className='filter_Set'>
                                                <p className='small_txt'>
                                                    <b>Airlines</b>
                                                    <small className="pink-text" style={{ float: 'right' }}>
                                                    {/* <i className="fa fa-angle-down" aria-hidden="true" ></i> */}
                                                    </small>
                                                </p>
                                                <Row>
                                                    <Col xs={12}>
                                                        <div className='checkbox-custom'>
                                                            <Form.Check type="checkbox" label="Aer Lingus(2) 103,931" />
                                                            <Form.Check type="checkbox" label="Alitalia(6) 86,227" />
                                                            <Form.Check type="checkbox" label="Aer Finance(2) 103,931" />
                                                            <Form.Check type="checkbox" label="American Airlines,102,750" />
                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Col>
                                                                               {/* ------ Main Datas ------ */}
                                                                               {total_response > 0 ? 
                                        <Col sm={12} md={9}>
                                            
                                            {/* Sorting Title */}
                                            <Row>
                                                <Col lg={7} md={7} sm={5} xs={6}>
                                                    <p>{total_response} results sorted by <b>{sortOption}</b></p>
                                                </Col>
                                                <Col lg={5} md={5} sm={6} xs={6} className='text-right'>                                                    
                                                        <div className="select_box outline"  style={{ float: 'right' }}>
                                                            <Form.Control as="select" name="sortoptions" defaultValue={"Best"}>
                                                                <option value="0" hidden>Sort by</option>
                                                                <option value="Best">Best</option>
                                                                <option value="Cheapest First">Cheapest First</option>
                                                                <option value="Fastest First">Fastest First</option>
                                                                <option value="Outbound: Departure Time">Outbound: Departure Time</option>
                                                                <option value="Airline">Airline</option>
                                                                <option value="Stops">Stops</option>
                                                            </Form.Control>
                                                        </div>
                                                </Col>
                                            </Row>

                                            {/* Filter Sorting Best, Cheapest, Fastest */}
                                            <div className='filter_sort'>
                                                <Row>
                                                    <Col xs={4} sm={4} className={sortOption == "Best" ? 'filter_tab text-center active' : 'filter_tab text-center'} data-tip data-for='best'>
                                                        <p onClick={handleSortBest}>Best<br></br>
                                                        <b>{getSymbolFromCurrency(currencyCode)} {bestPrice()}</b>
                                                        <br></br>{bestDuration()}</p>
                                                    </Col>
                                                    <ReactTooltip id='best' place="top" type="light" effect="solid" aria-haspopup='true' role='example' className='tool'>
                                                        <p>We think these flights offer the best combination of <br></br><b>price</b> and <b>speed</b>. We may also consider factors like <br></br>number of stops and mount of hassle.</p>
                                                    </ReactTooltip>
                                                    <Col xs={4} sm={4} className={sortOption == "Cheapest First" ? 'filter_tab text-center active' : 'filter_tab text-center'} data-tip data-for='cheapest'>
                                                        <p onClick={handleSortCheapest}>Cheapest<br></br>
                                                        <b>{getSymbolFromCurrency(currencyCode)} {cheapestPrice()}</b>
                                                        <br></br>{cheapestDuration()}</p>
                                                    </Col>
                                                    <ReactTooltip id='cheapest' place="top" type="light" effect="solid" aria-haspopup='true' role='example' className='tool'>
                                                        <p>Sort by Cheatpest Price.</p>
                                                    </ReactTooltip>
                                                    <Col xs={4} sm={4} className={sortOption == "Fastest First" ? 'filter_tab text-center active' : 'filter_tab text-center'} data-tip data-for='fastest'>
                                                        <p onClick={handleSortFastest}>Fastest<br></br>
                                                        <b>{getSymbolFromCurrency(currencyCode)} {fastestPrice()} </b>
                                                        <br></br>{fastestDuration()}</p>
                                                    </Col>
                                                    <ReactTooltip id='fastest' place="top" type="light" effect="solid" aria-haspopup='true' role='example' className='tool'>
                                                        <p>Sort by Shortest Duration.</p>
                                                    </ReactTooltip>
                                                </Row>
                                            </div>

                                            {/* Common for sorting datas */}
                                            <div className='custom-container'>
                                                <div className='container' style={{padding: '0'}}>
                                                    <div className="sort-title d_flex">
                                                        <Row>
                                                            <Col xs={8} sm={8}>
                                                                <h3 className="bold-text">Smart value Flights</h3>
                                                                <p>Popularity based on customer preference, duration & price</p>
                                                            </Col>
                                                            <Col xs={4} sm={4} className="text-right" style={{borderLeft: '1px solid #d5cece'}}>
                                                                <div className="topright-price">
                                                                    <big><span className="pink-text">Chepeast Starting at</span></big>
                                                                    <br />
                                                                    <span className="top-currency">
                                                                        {getSymbolFromCurrency(currencyCode)}
                                                                         &nbsp;{cheapestPrice()}
                                                                    </span>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* End common title */}
                                            {/* Start ------------------------------------------------------------ */}
                                            {/* Sorting Area */}
                                            {jsondata.recommendation.map((resultData, i = 1) => (
                                                <Row className="sort-box" key={resultData.recommendationRefNo}>
                                                    <Col sm={9} style = {{ padding: '10px', borderRight: '1px dashed #03A9F4' }}>
                                                        {resultData.totalFare == cheapestPrice() ? <button className="pink-button cheap">CHEAPEST</button> : <button className="pink-button cheap">VALUE FOR MONEY</button>}
                                                        {/* Departure flights */}
                                                        <Row className="travel-timing" style={{ marginTop: '6px' }}>
                                                            <Col md={12} sm={12}>
                                                                <b>Departure</b> | {dateFormat(changeMonthDate(resultData.flightLeg[0].flightDetails.departureDate), "ddd, mmm d")} | {resultData.flightLeg[0].flightDetails.operatingAirlineName}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={3} sm={4} className = ''>
                                                                <p className="sort-countryname">{resultData.marketingAirlineNames}</p>
                                                            </Col>
                                                            <Col xs={9} sm={8} className="flight-details">
                                                                <Row>
                                                                    <Col xs={4}>
                                                                        <div className="start-time text-right" htmlFor={`test` + i}>
                                                                            {TimeSplit(resultData.flightLeg[0].flightDetails.departureTime)}
                                                                            <p className="mini-text">{resultData.flightLeg[0].flightDetails.departureLocationCode}</p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={4} className='text-center'>
                                                                        <div className='hrs'>
                                                                            <span className="mini-text">{CalculateDuration(resultData.flightLeg[0].flightDetails.totalFlyingHours)}</span>
                                                                            <span className="line_jet"></span>
                                                                            <span className={StopClassName(resultData.flightLeg[0].flightDetails.stopOvers)}></span>
                                                                            <span className="mini-text sky-text">{StopName(resultData.flightLeg[0].flightDetails.stopOvers)} {resultData.flightLeg[0].flightDetails.stopOvers > 0 ? <span> via <span className="via-city">{ViaCityName(resultData.flightLeg[0].flightDetails.connectingFlightDetails[0].arrivalLocationName)}</span> </span>: null }</span>
                                                                            <img className="fa fa-fighter-jet autocomplete-flight-img" alt="Flight" src="static/images/flight.png" width="16px" />
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={4}>
                                                                        <div className="start-time">
                                                                            {TimeSplit(resultData.flightLeg[0].flightDetails.arrivalTime)}
                                                                            <p className="mini-text">{resultData.flightLeg[0].flightDetails.arrivalLocationCode}</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        {/* End Departure Flights */}
                                                        {/* Return Flights */}
                                                        <Row className="travel-timing" style={{ marginTop: '6px' }}>
                                                            <Col md={12} sm={12}>
                                                                <b>Return</b> | {dateFormat(changeMonthDate(resultData.flightLeg[1].flightDetails.departureDate), "ddd, mmm d")} | {resultData.flightLeg[1].flightDetails.operatingAirlineName}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={3} sm={4} className = ''>
                                                                <p className="sort-countryname">{resultData.marketingAirlineNames}</p>
                                                            </Col>
                                                            <Col xs={9} sm={8} className="flight-details">
                                                                <Row>
                                                                    <Col xs={4}>
                                                                        <div className="start-time text-right" htmlFor={`test` + i}>
                                                                            {TimeSplit(resultData.flightLeg[1].flightDetails.departureTime)}
                                                                            <p className="mini-text">{resultData.flightLeg[1].flightDetails.departureLocationCode}</p>
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={4} className='text-center'>
                                                                        <div className='hrs'>
                                                                            <span className="mini-text">{CalculateDuration(resultData.flightLeg[1].flightDetails.totalFlyingHours)}</span>
                                                                            <span className="line_jet"></span>
                                                                            <span className={StopClassName(resultData.flightLeg[1].flightDetails.stopOvers)}></span>
                                                                            <span className="mini-text sky-text">{StopName(resultData.flightLeg[1].flightDetails.stopOvers)}{resultData.flightLeg[1].flightDetails.stopOvers > 0 ? <span> via <span className="via-city">{ViaCityName(resultData.flightLeg[1].flightDetails.connectingFlightDetails[0].arrivalLocationName)}</span> </span>: null }</span>
                                                                            <img className="fa fa-fighter-jet autocomplete-flight-img" alt="Flight" src="static/images/flight.png" width="16px" />
                                                                        </div>
                                                                    </Col>
                                                                    <Col xs={4}>
                                                                        <div className="start-time">
                                                                            {TimeSplit(resultData.flightLeg[1].flightDetails.arrivalTime)}
                                                                            <p className="mini-text">{resultData.flightLeg[1].flightDetails.arrivalLocationCode}</p>
                                                                        </div>
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        {/* End Return Flights */}
                                                    </Col>
                                                    <Col sm={3} className='text-center set_bg'>
                                                        <span className="sort-currency">
                                                            <span className="deals_no">
                                                                8 deals
                                                            </span><br/>
                                                            {getSymbolFromCurrency(jsondata.currencyCode)}
                                                            &nbsp;{resultData.totalFare}
                                                        </span>
                                                        {/* <a href={`/ticketdetails?id=${2}`}>
                                                            <button className="bpk-button">Select <i className="fa fa-arrow-right"></i></button>
                                                        </a> */}
                                                        {/* <Link href={{ pathname: 'ticketdetails', query: { id: resultData.recommendationRefNo }}}> */}
                                                        <button className="bpk-button" onClick={() => showFlightDetails(resultData.recommendationRefNo)}>Select <i className="fa fa-arrow-right"></i></button>
                                                        {/* </Link> */}
                                                    </Col>
                                                    <Row className="flight-details">
                                                        <Col sm={12} className="text-center grey">
                                                            <span>Cabin Baggage Only Flights</span>
                                                        </Col>
                                                    </Row>
                                                    <Row className="flight-details bottom">
                                                        <Col sm={8} xs={7}>
                                                            <p>
                                                                <i className="fa fa-star"></i>
                                                                <b className='green-text'>8.5<small>/10</small></b>
                                                                <span className=""> Non-refundable</span>
                                                                <i className="fa fa-angle-down" aria-hidden="true" ></i> | 
                                                                <span>Seat varies by flight segment</span>
                                                            </p>
                                                        </Col>
                                                    </Row>
                                                </Row>
                                            ))}
                                            {/* Ending Sorting Area */}

                                        </Col> : <center>No data found</center> }
                                       {/* --------End main datas------- */}
                                    </Row>
                                </Col>
                                
                                {/* Ad */}
                                <Col sm={12} md={12} lg={2} xl={2} className='text-center'>
                                    <Row>
                                        <Col md={4} lg={12}>
                                            <div className="ad-block">
                                                <p>Place for ad</p>
                                            </div>
                                        </Col>
                                        <Col md={4} lg={12}>
                                            <div className="ad-block">
                                                <p>Place for ad</p>
                                            </div>
                                        </Col>
                                        <Col md={4} lg={12}>
                                            <div className="ad-block">
                                                <p>Place for ad</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </Layout>
        )
}

// TicketBooking.getInitialProps = ({ query: { departureLocationCode,arrivalLocationCode,departureDate,returnDate,isDirectFlight,searchType,adultCount,childCount,preferedFlightClass,departureTime,returnTime,departureLocationName,arrivalLocationName} }) => {
//     return { 
//         departureLocationCode: departureLocationCode, 
// 		arrivalLocationCode: arrivalLocationCode, 
//         departureDate: departureDate,
//         returnDate: returnDate,
//         isDirectFlight : isDirectFlight,
//         searchType: searchType,
//         adultCount: adultCount,
//         childCount: childCount,
//         preferedFlightClass: preferedFlightClass,
//         departureTime: "Any",
//         returnTime: "Any",
//         departureLocationName: departureLocationName,
//         arrivalLocationName: arrivalLocationName
//      }
//   }

TicketBooking.getInitialProps = async ({ query: {adultCount,childCount,infantCount,isDirectFlight,isPlusOrMinus3Days,searchType,preferedFlightClass,departureLocationCode,departureDate,arrivalLocationCode,returnDate,departureTime,returnTime,PageIndex,PageSize,departureLocationName,arrivalLocationName } }) => {
const request = {
    "adultCount": adultCount,
    "childCount": childCount,
    "infantCount": infantCount,
    "isDirectFlight": isDirectFlight,
    "isPlusOrMinus3Days": isPlusOrMinus3Days,
    "searchType": searchType,
    "preferedFlightClass": preferedFlightClass,
        "segments": [
        {
            "departureLocationCode": departureLocationCode,
            "departureDate": departureDate,
            "arrivalLocationCode": arrivalLocationCode,
            "returnDate": returnDate,
            "departureTime": departureTime,
            "returnTime": returnTime
        }
    ],
    "paging": {
        "PageIndex": PageIndex,
        "PageSize": PageSize
    }};

    const res = await getFlights(request)
    const json = await res;
    return { 
        flights: json,
        request: { 
            "adultCount": adultCount,
            "childCount": childCount,
            "infantCount": infantCount,
            "isDirectFlight": isDirectFlight,
            "isPlusOrMinus3Days": isPlusOrMinus3Days,
            "searchType": searchType,
            "preferedFlightClass": preferedFlightClass,
            "departureLocationName": departureLocationName,
            "arrivalLocationName": arrivalLocationName,
                "segments": [
                {
                    "departureLocationCode": departureLocationCode,
                    "departureDate": departureDate,
                    "arrivalLocationCode": arrivalLocationCode,
                    "returnDate": returnDate,
                    "departureTime": departureTime,
                    "returnTime": returnTime
                }
            ],
            "paging": {
                "PageIndex": PageIndex,
                "PageSize": PageSize
            }
        }
        }
        }

  export default TicketBooking;