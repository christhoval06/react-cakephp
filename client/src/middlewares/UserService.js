import { endpoint } from '../config'
import { headers, promise } from './Service'
class UserService {
  contact(request) {
    let resource = endpoint('user/contact')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  changeStatus(request) {
    let resource = endpoint('user') + '/change-status'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  changePassword(request) {
    let resource = endpoint('user') + '/change-password'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  resetPassword(request) {
    let resource = endpoint('user') + '/reset-password'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  getProfile(request) {
    let resource = endpoint('user') + '/profile'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  updateProfile(request) {
    let resource = endpoint('user') + '/update-profile'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
  getLeads(request) {
    let resource = endpoint('user/leads')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }

  updateProp(request) {
    let resource = endpoint('user/update-prop')
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
}
export default UserService
