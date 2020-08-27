import store from '../store'
import {
  INCREMENT_LOADING,
  DECREMENT_LOADING,
  SET_CATEGORIES,
  SET_DIFFICULTIES,
  CATEGORY_CHECK_TOGGLE,
  DIFFICULTY_CHECK_TOGGLE
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

export function categoryCheckToggle (category, callback = null) {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: CATEGORY_CHECK_TOGGLE,
      category: category
    })
    resolve()
  })
}

export function difficultyCheckToggle (difficulty, callback = null) {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: DIFFICULTY_CHECK_TOGGLE,
      difficulty: difficulty
    })
    resolve()
  })
}
