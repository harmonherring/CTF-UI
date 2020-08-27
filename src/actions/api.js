import store from '../store'
import {
    GET,
    incrementLoading,
    decrementLoading,
    setCategories,
    setDifficulties
} from './index'

export function getCategories() {
    incrementLoading()
    const state = store.getState()
    return GET(state.oidc.user.access_token, '/categories')
    .then(response => response.json())
    .then(jsonresponse => setCategories(jsonresponse))
    .then(() => decrementLoading());
}

export function getDifficulties() {
    incrementLoading()
    const state = store.getState()
    return GET(state.oidc.user.access_token, '/difficulties')
    .then(response => response.json())
    .then(jsonresponse => setDifficulties(jsonresponse))
    .then(() => decrementLoading());
}