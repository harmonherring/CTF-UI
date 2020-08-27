import store from '../store'
import {
  GET,
  incrementLoading,
  decrementLoading,
  setCategories,
  setDifficulties
} from './index'

export function getCategories (shouldIncrementLoading = true) {
  if (shouldIncrementLoading) incrementLoading()
  const state = store.getState()
  GET(state.oidc.user.access_token, '/categories')
    .then(response => response.json())
    .then(jsonresponse => {
      for (const key of Object.keys(jsonresponse)) {
        jsonresponse[key].checked = true
      }
      setCategories(jsonresponse)
      if (shouldIncrementLoading) decrementLoading()
    })
}

export function getDifficulties (shouldIncrementLoading = true) {
  if (shouldIncrementLoading) incrementLoading()
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
      if (shouldIncrementLoading) decrementLoading()
    })
}
