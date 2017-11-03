import {
  REQUEST_AUTH,
  RECEIVE_AUTH,
  REQUEST_SESSION,
  RECEIVE_SESSION,
  REQUEST_VALIDATE,
  RECEIVE_VALIDATE,
  RECEIVE_ERROR,
  UPDATE_WHITELIST_URL,
  REMOVE_WHITELIST_URL,
  CREATE_WHITELIST_URL
} from '../actions/Auth'

function auth(state = {}, action) {
  var whitelist;
  switch(action.type) {
    case CREATE_WHITELIST_URL:
      whitelist = state.network_url_whitelist
      if (!whitelist || whitelist === null) {
        whitelist = []
      }
      else {
        whitelist = whitelist.split(',')
      }
      whitelist.push(action.defaultValue)
      return Object.assign({}, state, {
        network_url_whitelist: whitelist.join(',')
      })
    case UPDATE_WHITELIST_URL:
      whitelist = state.network_url_whitelist.split(',')
      whitelist[action.index] = action.value
      return Object.assign({}, state, {
        network_url_whitelist: whitelist.join(',')
      })
    case REMOVE_WHITELIST_URL:
      whitelist = state.network_url_whitelist.split(',')
      whitelist.splice(action.index, 1)
      return Object.assign({}, state, {
        network_url_whitelist: whitelist.join(',')
      })
    case REQUEST_VALIDATE:
      return Object.assign({}, state, {
        error: false,
        message: null,
        username: null,
        token: null,
        role: null
      })
    case RECEIVE_VALIDATE:
      if (action.response.error) {
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
      }
      return Object.assign({}, state, action.response)
    case REQUEST_AUTH:
      return Object.assign({}, state, {
        processing: true,
        error: false,
        message: null,
        username: null,
        token: null,
        role: null
      })
    case RECEIVE_AUTH:
      var username = action.response.username
      if (username && username !== null) {
        localStorage.setItem('username', username)
      }
      var token = action.response.token
      if (token && token !== null) {
        localStorage.setItem('token', token)
      }
      var role = action.response.role
      if (role && role !== null) {
        localStorage.setItem('role', role)
      }
      return Object.assign({}, state, action.response, {
        processing: false
      })
    case REQUEST_SESSION:
      return Object.assign({}, state, {
        username: null,
        token: null,
        role: null
      })
    case RECEIVE_SESSION:
      return Object.assign({}, state, {
        username: action.username,
        token: action.token,
        role: action.role
      })
    case RECEIVE_ERROR:
      return Object.assign({}, state, {
        error: action.error,
        args: action.args
      })
    default:
      return state
  }
}

export default auth
