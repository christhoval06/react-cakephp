import {
  USER_RESET,
  USER_REQUEST_CHANGE_STATUS,
  USER_RECEIVE_CHANGE_STATUS,
  USER_ASK_TO_CHANGE_PASSWORD,
  USER_ASK_TO_RESET_PASSWORD,
  USER_ASK_TO_CHANGE_PROFILE,
  USER_REQUEST_CHANGE_PASSWORD,
  USER_RECEIVE_CHANGE_PASSWORD,
  USER_REQUEST_RESET_PASSWORD,
  USER_RECEIVE_RESET_PASSWORD,
  USER_REQUEST_GET_PROFILE,
  USER_RECEIVE_GET_PROFILE,
  USER_REQUEST_UPDATE_PROFILE,
  USER_RECEIVE_UPDATE_PROFILE,
  USER_RECEIVE_ERROR,
  USER_REQUEST_CONTACT,
  USER_RECEIVE_CONTACT,
  USER_REQUEST_LEADS,
  USER_RECEIVE_LEADS
}
from '../actions/User'

function user(state = {
  shouldChangePassword: false,
  shouldResetPassword: false,
  shouldChangeProfile: false,
  operationInProgress: false,
  executeStatus: 'pending',
  executeProcess: null,
  executeMessage: null,
  validationErrors: [],
  updateRecords: [],
  leads: []
}, action) {
  switch(action.type) {
    case USER_REQUEST_LEADS:
      return Object.assign({}, state)
    case USER_RECEIVE_LEADS:
      return Object.assign({}, state, {
        leads: action.response.data
      })
    case USER_RESET:
      return Object.assign({}, state, {
        shouldChangePassword: false,
        shouldResetPassword: false,
        shouldChangeProfile: false,
        shouldChangeProfileArgs: null,
        operationInProgress: false,
        executeStatus: 'pending',
        executeProcess: null,
        executeMessage: null,
        validationErrors: [],
        updateRecords: []
      })
    case USER_REQUEST_GET_PROFILE:
      return Object.assign({}, state, {
        shouldChangeProfileArgs: action.request.args
      })
    case USER_RECEIVE_GET_PROFILE:
      return Object.assign({}, state, {
        shouldChangeProfile: true,
        profile: action.response.profile
      })
    case USER_REQUEST_CONTACT:
      return Object.assign({}, state, {
        executeProcess: 'contact',
        operationInProgress: true
      })
    case USER_RECEIVE_CONTACT:
      return Object.assign({}, state, {
        validationErrors: action.response.validationErrors || [],
        operationInProgress: false,
        executeProcess: null
      })
    case USER_REQUEST_UPDATE_PROFILE:
      return Object.assign({}, state, {
        shouldChangeProfile: true,
        operationInProgress: true,
        executeProcess: 'updateProfile'
      })
    case USER_RECEIVE_UPDATE_PROFILE:
      return Object.assign({}, state, {
        shouldChangeProfile: action.response.error || action.response.valid === false,
        operationInProgress: false,
        validationErrors: action.response.validationErrors || [],
        executeStatus: action.response.error ? 'pending' : 'success',
        executeMessage: action.response.error ? null : action.response.message
      })
    case USER_ASK_TO_CHANGE_PASSWORD:
      return Object.assign({}, state, {
        shouldChangePassword: true
      })
    case USER_ASK_TO_RESET_PASSWORD:
      return Object.assign({}, state, {
        shouldResetPassword: true
      })
    case USER_ASK_TO_CHANGE_PROFILE:
      return Object.assign({}, state, {
        shouldChangeProfile: true,
        shouldChangeProfileArgs: action.args
      })
    case USER_REQUEST_CHANGE_PASSWORD:
      return Object.assign({}, state, {
        shouldChangePassword: true,
        operationInProgress: true
      })
    case USER_RECEIVE_CHANGE_PASSWORD: {
      return Object.assign({}, state, {
        shouldChangePassword: action.response.error || action.response.valid === false,
        operationInProgress: false,
        validationErrors: action.response.validationErrors || []
      })
    }
    case USER_REQUEST_RESET_PASSWORD:
      return Object.assign({}, state, {
        shouldResetPassword: true,
        operationInProgress: true
      })
    case USER_RECEIVE_RESET_PASSWORD:
      return Object.assign({}, state, {
        shouldResetPassword: action.response.error || action.response.valid === false,
        operationInProgress: false,
        validationErrors: action.response.validationErrors || []
      })
    case USER_RECEIVE_ERROR:
      return Object.assign({}, state, {
        executeStatus: 'error',
        executeMessage: action.message,
        operationInProgress: false
      })
    case USER_RECEIVE_CHANGE_STATUS:
      return Object.assign({}, state, {
        executeStatus: action.response.error ? 'error' : 'success',
        executeMessage: action.response.message,
        updateRecords: [{
          id: action.request.id,
          field: 'status',
          value: action.request.status
        }]
      })
    case USER_REQUEST_CHANGE_STATUS:
    default:
      return state
  }
}

export default user
