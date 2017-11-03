import {
  SHOW_FILTERS,
  HIDE_FILTERS
} from '../actions/Grid'

function grid(state = {}, action) {
  switch(action.type) {
    case SHOW_FILTERS:
      return Object.assign({}, state, {
        showFilters: true
      })
    case HIDE_FILTERS:
      return Object.assign({}, state, {
        showFilters: false
      })
    default:
      return state
  }
}
export default grid
