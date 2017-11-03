import { endpoint } from '../config'
import { headers, promise } from './Service'

class SubscriptionService {
  buyPackage(request) {
    let resource = endpoint('subscription') + '/buy-package'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  getStatus(request) {
    let resource = endpoint('subscription') + '/status'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  createPayment(request) {
    let resource = endpoint('subscription') + '/create-payment'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  checkCoupon(request) {
    let resource = endpoint('subscription/check-coupon')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  requestInvoice(request) {
    let resource = endpoint('subscription/request-invoice')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  setInvoice(request) {
    let resource = endpoint('subscription/set-invoice')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
}

export default SubscriptionService
