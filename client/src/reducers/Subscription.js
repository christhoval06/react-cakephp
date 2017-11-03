import {
  REQUEST_BUY_PACKAGE,
  RECEIVE_BUY_PACKAGE,
  REQUEST_GET_STATUS,
  RECEIVE_GET_STATUS,
  REQUEST_CREATE_PAYMENT,
  RECEIVE_CREATE_PAYMENT,
  REQUEST_CHECK_COUPON,
  RECEIVE_CHECK_COUPON,
  REQUEST_INVOICE,
  RECEIVE_INVOICE,
  REQUEST_SET_INVOICE,
  RECEIVE_SET_INVOICE,
  RESET
}
from '../actions/Subscription'

function subscription(state = {
  shouldRedirectToPaypal: false,
  shouldDisplayMessage: false,
  shouldDisplayAlert: false,
  paypalRedirectAction: null,
  displayMessageType: null,
  displayMessage: null,
  status: null,
  expiry: null,
  days: null,

  paymentStatus: 'pending',
  paymentMessage: null,

  discount: {
    error: false,
    price: 0,
    message: null,
    package: null
  },
  invoice: {
    operation: 'none',
    requestingFor: null,
    status: 'none'
  }
}, action) {
  switch(action.type) {

    case RESET:
      return Object.assign({}, state, {
        shouldRedirectToPaypal: false,
        shouldDisplayMessage: false,
        paypalRedirectAction: null,
        displayMessageType: null,
        displayMessage: null,

        paymentStatus: 'pending'
      })
    case REQUEST_SET_INVOICE:
      return Object.assign({}, state, {
        invoice: Object.assign({}, state, {
          operation: 'requesting-set-invoice',
          requestingFor: action.request.id,
          status: 'loading'
        })
      })
    case RECEIVE_SET_INVOICE:
      return Object.assign({}, state, {
        invoice: Object.assign({}, state.invoice, {
          status: 'completed'
        })
      })
    case REQUEST_INVOICE:
      return Object.assign({}, state, {
        invoice: Object.assign({}, state.invoice, {
          operation: 'requesting-invoice',
          requestingFor: action.request.id,
          status: 'loading'
        })
      })
    case RECEIVE_INVOICE:
      return Object.assign({}, state, {
        invoice: Object.assign({}, state.invoice, {
          status: 'completed'
        })
      })
    case REQUEST_CREATE_PAYMENT:
      return Object.assign({}, state, {
        paymentStatus: 'running' ,
        paymentMessage: null
      })
    case RECEIVE_CREATE_PAYMENT:
      return Object.assign({}, state, {
        paymentStatus: action.response.error ? 'error' : 'success',
        paymentMessage: action.response.message,
        shouldDisplayAlert: !action.response.error,
        alertStyle: action.response.error ? 'error' : 'success',
        status: action.response.error ? null : 'activated'
      })
    case RECEIVE_GET_STATUS:
      var accepted = ['expired', 'expiring', 'pending']
      var styles = {
        pending: 'info',
        expired: 'danger',
        expiring: 'warning'
      }
      var status = action.response.status
      return Object.assign({}, state, action.response, {
        shouldDisplayAlert: accepted.find(a => a === status) === status,
        alertStyle: styles[action.response.status]
      })
    case RECEIVE_BUY_PACKAGE:
      return Object.assign({}, state, {
        shouldRedirectToPaypal: !action.response.error,
        paypalRedirectAction: action.response.redirect,
        shouldDisplayMessage: action.response.error,
        displayMessage: action.response.message,
        displayMessageType: action.response.error ? 'error' : 'success'
      })
    case REQUEST_CHECK_COUPON:
      return Object.assign({}, state, {
        discount: {
          error: false,
          price: 0,
          message: null,
          package: null
        }
      })
    case RECEIVE_CHECK_COUPON:
      return Object.assign({}, state, {
        discount: {
          error: action.response.error,
          price: parseFloat(action.response.discount || 0),
          coupon: action.response.coupon,
          message: action.response.message,
          package: action.response.package
        }
      })
    case REQUEST_GET_STATUS:
      /**
       * You can ask for status any time.
       * When the status is "pending" we should always provide visible alert
       * because user is executing a payment and is waiting for a paypal response.
       * @type {[type]}
       */
      return Object.assign({}, state, {
        shouldDisplayAlert: state.status === 'pending',
        status: state.status !== 'pending' ? 'loading' : 'pending'
      })
    case REQUEST_BUY_PACKAGE:
    default:
      return state

  }
}

export default subscription
