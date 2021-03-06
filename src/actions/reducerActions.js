import store from '../store'
import {
  SHOW_MODAL,
  HIDE_MODAL,
  INCREMENT_LOADER,
  DECREMENT_LOADER,
  SET_CATEGORIES,
  SET_DIFFICULTIES,
  CATEGORY_CHECK_TOGGLE,
  DIFFICULTY_CHECK_TOGGLE,
  SET_CHALLENGES
} from '../constants'

export function createModal (
  type = 'GenericModal',
  title = '',
  text = '',
  actionButtonText = '',
  actionButtonCallback = null,
  exitButtonText = '',
  exitCallback = null
) {
  store.dispatch({
    type: SHOW_MODAL,
    modal: {
      type,
      title,
      text,
      actionButtonText,
      actionButtonCallback,
      exitButtonText,
      exitCallback
    }
  })
}

export function hideModal () {
  store.dispatch({
    type: HIDE_MODAL
  })
}

export function incrementLoader (loader) {
  store.dispatch({
    type: INCREMENT_LOADER,
    loader: loader
  })
}

export function decrementLoader (loader) {
  store.dispatch({
    type: DECREMENT_LOADER,
    loader: loader
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

export function setChallenges (challenges) {
  return new Promise((resolve, reject) => {
    store.dispatch({
      type: SET_CHALLENGES,
      challenges: challenges
    })
    resolve()
  })
}
