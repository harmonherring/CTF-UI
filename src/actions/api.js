import store from '../store'
import {
  GET,
  incrementLoader,
  decrementLoader,
  setCategories,
  setDifficulties
} from './index'
import { setChallenges } from './reducerActions'

export function getCategories (loader = 'blockingLoad') {
  if (loader) incrementLoader(loader)
  const state = store.getState()
  GET(state.oidc.user.access_token, '/categories')
    .then(response => response.json())
    .then(jsonresponse => {
      for (const key of Object.keys(jsonresponse)) {
        jsonresponse[key].checked = true
      }
      setCategories(jsonresponse)
      if (loader) decrementLoader(loader)
    })
}

export function getDifficulties (loader = 'blockingLoad') {
  if (loader) incrementLoader(loader)
  const state = store.getState()
  GET(state.oidc.user.access_token, '/difficulties')
    .then(response => response.json())
    .then(jsonresponse => {
      const difficulties = {}
      for (const difficulty of jsonresponse) {
        difficulties[difficulty.name] = {
          ...difficulty,
          checked: true
        }
      }
      setDifficulties(difficulties)
      if (loader) decrementLoader(loader)
    })
}

export function getChallenges (categories, difficulties, search, sort, order, limit, offset, loader = 'nonBlockingLoad', reset = false) {
  const state = store.getState()
  if (loader) incrementLoader(loader)
  return GET(state.oidc.user.access_token,
    `/challenges?categories=${categories}&difficulties=${difficulties}&search=${search}&sort_by=${sort}&order_by=${order}&limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(jsonresponse => {
      const newChallenges = {}
      for (const value of jsonresponse) {
        newChallenges[value.id] = value
      }
      if (reset) {
        return setChallenges(newChallenges)
      } else {
        return setChallenges({
          ...state.challenges,
          ...newChallenges
        })
      }
    })
    .then(() => {
      if (loader) decrementLoader(loader)
    })
}
