import {
  REQUEST_DATA,
  RECEIVE_DATA,
  RECEIVE_ERROR
}
from '../actions/Console'

function console(state = {
  data: null
}, action) {
  switch(action.type) {
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        data: action.response
      })
    case RECEIVE_ERROR:
      return Object.assign({}, state, {
        error: true,
        message: action.error.message
      })
    case REQUEST_DATA:
    default:
      return state
  }
}

export default console
