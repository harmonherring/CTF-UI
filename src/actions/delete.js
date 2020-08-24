import fetchAPI from './fetchAPI'

// Credit to @ramzallan in tonic

// eslint-disable-next-line no-unused-vars
export default function DELETE (accessToken, route, body) {
  return fetchAPI(process.env.REACT_APP_API_ROUTE + route, {
    method: 'DELETE',
    mode: 'cors',
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
}
