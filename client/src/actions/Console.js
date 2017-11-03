import ConsoleService from '../middlewares/ConsoleService'
import { showLoader, hideLoader } from './App'

export const REQUEST_DATA = 'CONSOLE_REQUEST_DATA'
export const RECEIVE_DATA = 'CONSOLE_RECEIVE_DATA'
export const RECEIVE_ERROR = 'CONSOLE_RECEIVE_ERROR'

export function requestData(request = null) {
  return {
    type: REQUEST_DATA,
    request: request
  }
}
export function receiveData(request, response) {
  return {
    type: RECEIVE_DATA,
    request: request,
    response: response
  }
}
export function receiveError(request, error) {
  return {
    type: RECEIVE_ERROR,
    request: request,
    error: error
  }
}

var service = new ConsoleService()

export function getData(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestData(request))
    service
      .getData(request)
      .then(response => {
        dispatch(receiveData(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}
