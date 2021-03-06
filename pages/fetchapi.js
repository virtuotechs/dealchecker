import React from 'react';

import axios from 'axios';

export default class Fetchapi extends React.Component {
  state = {
    persons: []
  }



  componentDidMount() {
    let url = 'https://pln.lycafly.com/Affiliate/Flight/Aw_SearchFlight';
    let headers = new Headers();
    axios(url,{method: 'POST',headers:{
      'Authorization': 'Basic 0b017b0c0d414e20ee0d2e4adbed686d7c297a6d2f8ec8f9eddc2016d9513482a086fe8712ef0530',
                                 'content-Type': 'application/json'
    },
    data: JSON.stringify(
      {
          "adultCount": "1",
          "childCount": "0",
          "infantCount": "0",
          "isDirectFlight": "false",
          "isPlusOrMinus3Days": "false",
          "searchType": "2",
          "preferedFlightClass": "1",
              "segments": [
              {
                  "departureLocationCode": "LON",
                  "departureDate": "20-10-2019",
                  "arrivalLocationCode": "DEL",
                  "returnDate": "26-10-2019",
                  "departureTime": "Any",
                  "returnTime": "Any"
              }
          ],
          "paging": {
              "PageIndex": "1",
              "PageSize": "50"
          }
          }
  ),
  })
      .then(res => {
        const persons = res.data;
        this.setState({ persons });
        console.log(persons);
      })
  }

  render() {
    return (
      <ul>
        {/* { this.state.persons.map(person => <li>{person.me}</li>)} */}
        <li>Test</li>
      </ul>
    )
  }
}