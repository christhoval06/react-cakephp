import AuthService from '../middlewares/AuthService'
import { showLoader, hideLoader } from './App'

function createService() {
  return new AuthService()
}

export const REQUEST_AUTH = 'REQUEST_AUTH'
export const RECEIVE_AUTH = 'RECEIVE_AUTH'
export const REQUEST_SESSION = 'AUTH_REQUEST_SESSION'
export const RECEIVE_SESSION = 'AUTH_RECEIVE_SESSION'
export const REQUEST_VALIDATE = 'AUTH_REQUEST_VALIDATE'
export const RECEIVE_VALIDATE = 'AUTH_RECEIVE_VALIDATE'
export const REQUEST_LOGOUT = 'AUTH_REQUEST_LOGOUT'
export const RECEIVE_LOGOUT = 'AUTH_RECEIVE_LOGOUT'
export const RECEIVE_ERROR = 'AUTH_RECEIVE_ERROR'
export const UPDATE_WHITELIST_URL = 'UPDATE_WHITELIST_URL'
export const REMOVE_WHITELIST_URL = 'REMOVE_WHITELIST_URL'
export const CREATE_WHITELIST_URL = 'CREATE_WHITELIST_URL'

export function createWhiteListUrl(defaultValue = 'example.com') {
  return {
    type: CREATE_WHITELIST_URL,
    defaultValue
  }
}
export function removeWhiteListUrl(index) {
  return {
    type: REMOVE_WHITELIST_URL,
    index
  }
}
export function updateWhiteListUrl(index, value) {
  return {
    type: UPDATE_WHITELIST_URL,
    index,
    value
  }
}
export function requestAuth(request) {
  return {
    type: REQUEST_AUTH,
    request: request
  }
}
export function receiveAuth(request, response) {
  return {
    type: RECEIVE_AUTH,
    request: request,
    response: response
  }
}
export function requestLogout() {
  return {
    type: REQUEST_LOGOUT
  }
}
export function receiveLogout() {
  return {
    type: RECEIVE_LOGOUT
  }
}
export function receiveError(error, args) {
  return {
    type: RECEIVE_ERROR,
    error,
    args
  }
}

export function requestSession() {
  return {
    type: REQUEST_SESSION
  }
}
export function receiveSession(session) {
  return {
    type: RECEIVE_SESSION,
    role: session.role,
    token: session.token
  }
}

export function requestValidate(token) {
  return {
    type: REQUEST_VALIDATE,
    token: token
  }
}
export function receiveValidate(token, response) {
  return {
    type: RECEIVE_VALIDATE,
    token: token,
    response: response
  }
}

export function resolveSession() {
  return dispatch => {
    dispatch(requestSession())
    var username = localStorage.getItem('username')
    var token = localStorage.getItem('token')
    var role = localStorage.getItem('role')
    dispatch(resolveSession({
      username: username,
      token: token,
      role: role
    }))
  }
}

export function validate(token) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestValidate(token))
    createService()
      .validate(token)
      .then(response => {
        dispatch(receiveValidate(token, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(error, { token }))
        dispatch(hideLoader())
      })
  }
}


export function login(username, password) {
  return dispatch => {
    var request = { username: username, password: password }
    dispatch(showLoader())
    dispatch(requestAuth(request))
    createService()
      .authenticate(request)
      .then(response => {
        dispatch(receiveAuth(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(error, { request }))
        dispatch(hideLoader())
      })
  }
}

export function logout(token) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestLogout())
    createService()
      .logout(token)
      .then(response => {
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        dispatch(hideLoader())
        dispatch(receiveLogout())
      })
  }
}
