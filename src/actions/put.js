import fetchAPI from './fetchAPI'

// Credit to @ramzallan in tonic

// eslint-disable-next-line no-unused-vars
export default function PUT (accessToken, route, body) {
  return fetchAPI(process.env.REACT_APP_API_ROUTE + route, {
    method: 'PUT',
    mode: 'cors',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
