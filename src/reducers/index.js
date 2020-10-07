import { combineReducers } from 'redux'
import { reducer as oidcReducer } from 'redux-oidc'
import { connectRouter } from 'connected-react-router'
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

function apis (state = {
  isFetching: false
},
action) {
  switch (action.type) {
    default:
      return state
  }
}

function modalReducer (state = {
  modal: {
    type: '',
    text: '',
    title: '',
    actionButtonText: '',
    actionButtonCallback: null,
    exitButtonText: '',
    exitCallback: null
  }
},
action) {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, { ...state }, { ...action.modal, visible: true })
    case HIDE_MODAL:
      return Object.assign({}, { ...state }, { visible: false })
    default:
      return state
  }
}

function loaders (state = {
  blockingLoad: 0,
  nonBlockingLoad: 0
}, action) {
  switch (action.type) {
    case INCREMENT_LOADER:
      return {
        ...state,
        [action.loader]: state[action.loader] + 1
      }
    case DECREMENT_LOADER:
      return {
        ...state,
        [action.loader]: state[action.loader] - 1
      }
    default:
      return state
  }
}

function ctfReducer (state = {
  categories: {},
  difficulties: {},
  challenges: []
}, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      // This ensures that existing challenges keep their checked state and deleted challenges are erased
      Object.keys(state.categories).forEach(key => {
        if (Object.keys(action.categories).includes(key)) {
          action.categories[key].checked = state.categories[key].checked
        }
      })
      return {
        ...state,
        categories: action.categories
      }
    case SET_DIFFICULTIES:
      // This ensures that existing difficulties keep their checked state and deleted difficulties are erased
      Object.keys(state.difficulties).forEach(key => {
        if (Object.keys(action.difficulties).includes(key)) {
          action.difficulties[key].checked = state.difficulties[key].checked
        }
      })
      return {
        ...state,
        difficulties: action.difficulties
      }
    case CATEGORY_CHECK_TOGGLE:
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.category]: {
            ...state.categories[action.category],
            checked: !state.categories[action.category].checked
          }
        }
      }
    case DIFFICULTY_CHECK_TOGGLE:
      return {
        ...state,
        difficulties: {
          ...state.difficulties,
          [action.difficulty]: {
            ...state.difficulties[action.difficulty],
            checked: !state.difficulties[action.difficulty].checked
          }
        }
      }
    case SET_CHALLENGES:
      return {
        ...state,
        challenges: action.challenges
      }
    default:
      return state
  }
}

export default (history) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  modal: modalReducer,
  loaders,
  ctf: ctfReducer,
  apis
})
