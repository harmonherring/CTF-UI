export { default as GET } from './get'
export { default as POST } from './post'
export { default as PUT } from './put'
export { default as DELETE } from './delete'
export {
  decrementLoader,
  incrementLoader,
  setCategories,
  setDifficulties,
  categoryCheckToggle,
  difficultyCheckToggle
} from './reducerActions'
export {
  getDifficulties,
  getCategories,
  getChallenges
} from './api'
