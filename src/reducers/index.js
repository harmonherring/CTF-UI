import { combineReducers } from 'redux'
import { reducer as oidcReducer } from 'redux-oidc'
import { connectRouter } from 'connected-react-router'
import {
  SHOW_MODAL,
  HIDE_MODAL,
  INCREMENT_LOADING,
  DECREMENT_LOADING,
  SET_CATEGORIES,
  SET_DIFFICULTIES
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
    continueButtonText: '',
    continueButtonCallback: null,
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

function loading (state = 0, action) {
  switch (action.type) {
    case INCREMENT_LOADING:
      return state + 1
    case DECREMENT_LOADING:
      return state - 1
    default:
      return state
  }
}

function ctfReducer (state = {
  categories: [],
  difficulties: []
}, action) {
  switch (action.type) {
    case SET_CATEGORIES:
      return Object.assign({}, { ...state }, { categories: action.categories })
    case SET_DIFFICULTIES:
      return Object.assign({}, { ...state }, { difficulties: action.difficulties })
    default:
      return state
  }
}

export default (history) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  modal: modalReducer,
  loading,
  ctf: ctfReducer,
  apis
})
