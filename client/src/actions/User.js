import UserService from '../middlewares/UserService'
import { showLoader, hideLoader } from './App'
export const USER_REQUEST_CHANGE_STATUS = 'USER_REQUEST_CHANGE_STATUS'
export const USER_RECEIVE_CHANGE_STATUS = 'USER_RECEIVE_CHANGE_STATUS'
export const USER_RECEIVE_ERROR = 'USER_RECEIVE_ERROR'
export const USER_ASK_TO_CHANGE_PASSWORD = 'USER_ASK_TO_CHANGE_PASSWORD'
export const USER_ASK_TO_RESET_PASSWORD = 'USER_ASK_TO_RESET_PASSWORD'
export const USER_ASK_TO_CHANGE_PROFILE = 'USER_ASK_TO_CHANGE_PROFILE'
export const USER_REQUEST_CHANGE_PASSWORD = 'USER_REQUEST_CHANGE_PASSWORD'
export const USER_RECEIVE_CHANGE_PASSWORD = 'USER_RECEIVE_CHANGE_PASSWORD'
export const USER_REQUEST_RESET_PASSWORD = 'USER_REQUEST_RESET_PASSWORD'
export const USER_RECEIVE_RESET_PASSWORD = 'USER_RECEIVE_RESET_PASSWORD'
export const USER_REQUEST_GET_PROFILE = 'USER_REQUEST_GET_PROFILE'
export const USER_RECEIVE_GET_PROFILE = 'USER_RECEIVE_GET_PROFILE'
export const USER_REQUEST_UPDATE_PROFILE = 'USER_REQUEST_UPDATE_PROFILE'
export const USER_RECEIVE_UPDATE_PROFILE = 'USER_RECEIVE_UPDATE_PROFILE'
export const USER_RESET = 'USER_RESET'
export const USER_REQUEST_CONTACT = 'USER_REQUEST_CONTACT'
export const USER_RECEIVE_CONTACT = 'USER_RECEIVE_CONTACT'
export const USER_REQUEST_LEADS = 'USER_REQUEST_LEADS'
export const USER_RECEIVE_LEADS = 'USER_RECEIVE_LEADS'
export const USER_REQUEST_UPDATE_PROP = 'USER_REQUEST_UPDATE_PROP'
export const USER_RECEIVE_UPDATE_PROP = 'USER_RECEIVE_UPDATE_PROP'

function requestUpdateProp(request) {
  return {
    type: USER_REQUEST_UPDATE_PROP,
    request
  }
}
function receiveUpdateProp(request, response) {
  return {
    type: USER_RECEIVE_UPDATE_PROP,
    request,
    response
  }
}
function requestLeads(request) {
  return {
    type: USER_REQUEST_LEADS,
    request
  }
}
function receiveLeads(request, response) {
  return {
    type: USER_RECEIVE_LEADS,
    request,
    response
  }
}
function requestContact(request) {
  return {
    type: USER_REQUEST_CONTACT,
    request
  }
}
function receiveContact(request, response) {
  return {
    type: USER_RECEIVE_CONTACT,
    request,
    response
  }
}
export function askToChangePassword() {
  return {
    type: USER_ASK_TO_CHANGE_PASSWORD
  }
}

export function askToResetPassword() {
  return {
    type: USER_ASK_TO_RESET_PASSWORD
  }
}

export function askToChangeProfile(args) {
  return {
    type: USER_ASK_TO_CHANGE_PROFILE,
    args
  }
}

export function requestGetProfile(request) {
  return {
    type: USER_REQUEST_GET_PROFILE,
    request: request
  }
}

export function receiveGetProfile(request, response) {
  return {
    type: USER_RECEIVE_GET_PROFILE,
    request: request,
    response: response
  }
}

export function requestUpdateProfile(request) {
  return {
    type: USER_REQUEST_UPDATE_PROFILE,
    request: request
  }
}

export function receiveUpdateProfile(request, response) {
  return {
    type: USER_RECEIVE_UPDATE_PROFILE,
    request: request,
    response: response
  }
}

export function requestResetPassword(request) {
  return {
    type: USER_REQUEST_RESET_PASSWORD,
    request: request
  }
}

export function receiveResetPassword(request, response) {
  return {
    type: USER_RECEIVE_RESET_PASSWORD,
    request: request,
    response: response
  }
}

export function requestChangePassword(request) {
  return {
    type: USER_REQUEST_CHANGE_PASSWORD,
    request: request
  }
}
export function receiveChangePassword(request, response) {
  return {
    type: USER_RECEIVE_CHANGE_PASSWORD,
    request: request,
    response: response
  }
}

export function requestChangeStatus(request) {
  return {
    type: USER_REQUEST_CHANGE_STATUS,
    request: request
  }
}

export function receiveChangeStatus(request, response) {
  return {
    type: USER_RECEIVE_CHANGE_STATUS,
    request: request,
    response: response
  }
}

export function receiveError(request, error) {
  return {
    type: USER_RECEIVE_ERROR,
    request: request,
    error: error
  }
}

export function reset() {
  return {
    type: USER_RESET
  }
}

var service = new UserService()
export function updateProp(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestUpdateProp(request))
    service
      .updateProp(request)
      .then(response => {
        dispatch(receiveUpdateProp(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}
export function contact(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestContact(request))
    service
      .contact(request)
      .then(response => {
        dispatch(receiveContact(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function changeStatus(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestChangeStatus(request))
    service
      .changeStatus(request)
      .then(response => {
        dispatch(receiveChangeStatus(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function changePassword(request) {
  return dispatch => {
    dispatch(requestChangePassword(request))
    service
      .changePassword(request)
      .then(response => {
        dispatch(receiveChangePassword(request, response))
      })
      .catch(error => {
        dispatch(receiveError(request, error))
      })
  }
}

export function resetPassword(request) {
  return dispatch => {
    dispatch(requestResetPassword(request))
    service
      .resetPassword(request)
      .then(response => {
        dispatch(receiveResetPassword(request, response))
      })
      .catch(error => {
        dispatch(receiveError(request, error))
      })
  }
}

export function getProfile(request) {
  return dispatch => {
    dispatch(requestGetProfile(request))
    dispatch(showLoader())
    service
      .getProfile(request)
      .then(response => {
        dispatch(receiveGetProfile(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function updateProfile(request) {
  return dispatch => {
    dispatch(requestUpdateProfile(request))
    service
      .updateProfile(request)
      .then(response => {
        dispatch(receiveUpdateProfile(request, response))
      })
      .catch(error => {
        dispatch(receiveError(request, error))
      })
  }
}

export function getLeads(request) {
  return dispatch => {
    dispatch(requestLeads(request))
    dispatch(showLoader())
    service
      .getLeads(request)
      .then(response => {
        dispatch(receiveLeads(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}
