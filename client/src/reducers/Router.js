import {
  PUSH
} from '../actions/Router'
import { hashHistory } from 'react-router'

function router(state = {}, action) {
  switch(action.type) {
    case PUSH:
      hashHistory.push(action.route)
      return Object.assign({}, state, {
        route: action.route
      })
    default:
      return state
  }
}

export default router
