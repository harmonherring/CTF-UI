import { combineReducers } from 'redux'
import { reducer as oidcReducer } from 'redux-oidc'
import { connectRouter } from 'connected-react-router'
import {
  SHOW_MODAL,
  HIDE_MODAL
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
    continueButtonCallback: null
  }
},
action) {
  switch (action.type) {
    case SHOW_MODAL:
      return Object.assign({}, { ...state }, { ...action.modal })
    case HIDE_MODAL:
      return Object.assign({}, { ...state }, { type: '' })
    default:
      return state
  }
}

export default (history) => combineReducers({
  router: connectRouter(history),
  oidc: oidcReducer,
  modal: modalReducer,
  apis
})
