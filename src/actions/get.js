import fetchAPI from './fetchAPI'

// Credit to @ramzallan in tonic

// eslint-disable-next-line no-unused-vars
export default function GET (accessToken, route) {
  return fetchAPI(process.env.REACT_APP_API_ROUTE + route, {
    method: 'GET',
    mode: 'cors',
    headers: {
      Authorization: 'Bearer ' + accessToken
    }
  })
}
