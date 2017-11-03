import {
  SHOW_LOADER,
  HIDE_LOADER
} from '../actions/App'

var loadingReuqests = 0
function app(state = {
  showLoader: false
}, action) {
  switch(action.type) {
    case SHOW_LOADER:
      loadingReuqests++
      return Object.assign({}, state, {
        showLoader: loadingReuqests > 0
      })
    case HIDE_LOADER:
      loadingReuqests--
      return Object.assign({}, state, {
        showLoader: loadingReuqests > 0
      })
    default:
      return state
  }
}
export default app
