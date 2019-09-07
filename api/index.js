import fetch from 'isomorphic-fetch'
import axios from 'axios';

const url = 'https://pln.lycafly.com/Affiliate/Flight/Aw_SearchFlight';

export function getFlights(request) {
  return axios(url,{method: 'POST',headers:{
    'Authorization': 'Basic 0b017b0c0d414e20ee0d2e4adbed686d7c297a6d2f8ec8f9eddc2016d9513482a086fe8712ef0530',
                               'content-Type': 'application/json'
  },
  data: JSON.stringify(request),
})
}

// export function getPost(slug) {
//   return fetch(`https://jsonplaceholder.typicode.com/posts?title=${slug}`)
// }