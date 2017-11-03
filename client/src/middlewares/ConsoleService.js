import { endpoint } from '../config'
function promise(resource, options) {
  return new Promise((resolve, reject) => {
    fetch(resource, options)
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
const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

class ConsoleService {
  getData(request) {
    let resource = endpoint('console') + '/data'
    let options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(request)
    }
    return promise(resource, options)
  }
}
export default ConsoleService
