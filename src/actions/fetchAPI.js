import fetch from 'cross-fetch'
import userManager from '../userManager'

export default function fetchAPI (route, obj) {
  return fetch(route, obj)
    .then(response => {
      if (response.status === 401) {
        userManager.signinRedirect()
      }
      return Promise.resolve(response)
    })
}
