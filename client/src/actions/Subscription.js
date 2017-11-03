import { format } from '../system/String'
import { endpoint } from '../config'
import { showLoader, hideLoader } from './App'
import SubscriptionService from '../middlewares/SubscriptionService'

export const PRINT_INVOICE = 'SUBSCRIPTION_PRINT_INVOICE'
export const REQUEST_BUY_PACKAGE = 'SUBSCRIPTION_REQUEST_BUY_PACKAGE'
export const RECEIVE_BUY_PACKAGE = 'SUBSCRIPTION_RECEIVE_BUY_PACKAGE'
export const REQUEST_GET_STATUS = 'SUBSCRIPTION_REQUEST_GET_STATUS'
export const RECEIVE_GET_STATUS = 'SUBSCRIPTION_RECEIVE_GET_STATUS'
export const REQUEST_CREATE_PAYMENT = 'SUBSCRIPTION_REQUEST_CREATE_PAYMENT'
export const RECEIVE_CREATE_PAYMENT = 'SUBSCRIPTION_RECEIVE_CREATE_PAYMENT'
export const RECEIVE_ERROR = 'SUBSCRIPTION_RECEIVE_ERROR'
export const RESET = 'SUBSCRIPTION_RESET'
export const REQUEST_CHECK_COUPON = 'SUBSCRIPTION_REQUEST_CHECK_COUPON'
export const RECEIVE_CHECK_COUPON = 'SUBSCRIPTION_RECEIVE_CHECK_COUPON'
export const REQUEST_INVOICE = 'SUBSCRIPTION_REQUEST_INVOICE'
export const RECEIVE_INVOICE = 'SUBSCRIPTION_RECEIVE_INVOICE'
export const REQUEST_SET_INVOICE = 'SUBSCRIPTION_REQUEST_SET_INVOICE'
export const RECEIVE_SET_INVOICE = 'SUBSCRIPTION_RECEIVE_SET_INVOICE'

var service = new SubscriptionService()
function requestSetInvoice(request) {
  return {
    type: REQUEST_SET_INVOICE,
    request
  }
}
function receiveSetInvoice(request, response) {
  return {
    type: RECEIVE_SET_INVOICE,
    request,
    response
  }
}
function requestInvoiceCall(request) {
  return {
    type: REQUEST_INVOICE,
    request
  }
}
function receiveInvoiceCall(request, response) {
  return {
    type: RECEIVE_INVOICE,
    request,
    response
  }
}
export function requestCreatePayment(request) {
  return {
    type: REQUEST_CREATE_PAYMENT,
    request: request
  }
}
export function receiveCreatePayment(request, response) {
  return {
    type: RECEIVE_CREATE_PAYMENT,
    request: request,
    response: response
  }
}

export function printInvoice(request) {
  let resource =
    endpoint('subscription') +
    format('/print-invoice/{0}/{1}', request.token, request.id)

  window.open(resource, '_blank')
  return {
    type: PRINT_INVOICE,
    resource: resource
  }
}

export function requestBuyPackage(request) {
  return {
    type: REQUEST_BUY_PACKAGE,
    request: request
  }
}
export function receiveBuyPackage(request, response) {
  return {
    type: RECEIVE_BUY_PACKAGE,
    request: request,
    response: response
  }
}
export function requestCheckCoupon(request) {
  return {
    type: REQUEST_CHECK_COUPON,
    request: request
  }
}
export function receiveCheckCoupon(request, response) {
  return {
    type: RECEIVE_CHECK_COUPON,
    request: request,
    response: response
  }
}
export function requestGetStatus(request) {
  return {
    type: REQUEST_GET_STATUS,
    request: request
  }
}
export function receiveGetStatus(request, response) {
  return {
    type: RECEIVE_GET_STATUS,
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

export function reset() {
  return {
    type: RESET
  }
}
export function setInvoice(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestSetInvoice(request))
    service
      .setInvoice(request)
      .then(response => {
        dispatch(receiveSetInvoice(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}
export function buyPackage(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestBuyPackage(request))
    service
      .buyPackage(request)
      .then(response => {
        dispatch(receiveBuyPackage(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function checkCoupon(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestCheckCoupon(request))
    service
      .checkCoupon(request)
      .then(response => {
        dispatch(receiveCheckCoupon(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function requestInvoice(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestInvoiceCall(request))
    service
      .requestInvoice(request)
      .then(response => {
        dispatch(receiveInvoiceCall(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}

export function getStatus(request) {
  return dispatch => {
    dispatch(requestGetStatus(request))
    service
      .getStatus(request)
      .then(response => {
        dispatch(receiveGetStatus(request, response))
      })
      .catch(error => {
        dispatch(receiveError(request, error))
      })
  }
}

export function createPayment(request) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestCreatePayment(request))
    service
      .createPayment(request)
      .then(response => {
        dispatch(receiveCreatePayment(request, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(request, error))
        dispatch(hideLoader())
      })
  }
}
