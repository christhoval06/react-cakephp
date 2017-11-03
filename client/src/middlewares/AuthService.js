import { endpoint } from '../config'
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

class AuthService {
  authenticate(request) {
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request || {})
    }
    var url = endpoint("authenticate");
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
          else {
            return {
              code: response.code,
              error: true,
              message: response.statusText
            }
          }
        })
        .then(json => resolve(json))
        .catch(error => reject(error))
    })
  }
  validate(token) {
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ token: token })
    }
    var url = endpoint("validate");
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
          else {
            return {
              code: response.code,
              error: true,
              message: response.statusText
            }
          }
        })
        .then(json => resolve(json))
        .catch(error => reject(error))
    })
  }

  logout(token) {
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ token: token })
    }
    var url = endpoint("logout")
    return new Promise((resolve, reject) => {
      fetch(url, options)
        .then(response => {
          if(response.ok) {
            return response.json()
          }
          else {
            return {
              code: response.code,
              error: true,
              message: response.statusText
            }
          }
        })
        .then(json => resolve(json))
        .catch(error => reject(error))
    })
  }
}

export default AuthService
