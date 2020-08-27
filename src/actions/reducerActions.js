import store from '../store'
import {
  INCREMENT_LOADING,
  DECREMENT_LOADING,
  SET_CATEGORIES,
  SET_DIFFICULTIES
} from '../constants'

export function incrementLoading () {
  store.dispatch({
    type: INCREMENT_LOADING
  })
}

export function decrementLoading () {
  store.dispatch({
    type: DECREMENT_LOADING
  })
}

export function setCategories (categories) {
  store.dispatch({
    type: SET_CATEGORIES,
    categories: categories
  })
}

export function setDifficulties (difficulties) {
  store.dispatch({
    type: SET_DIFFICULTIES,
    difficulties: difficulties
  })
}
