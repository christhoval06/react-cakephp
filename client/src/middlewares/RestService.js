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
class RestService {

  constructor(params = { resource: null }) {
    if (!params) {
      throw new Error('Arguments cannot be null.')
    }
    if (!params.resource || params.resource == null || params.resource.length === 0) {
      throw new Error('Param { resource } cannot be null.')
    }

    this.resource = params.resource
  }

  list(request) {
    var resource = this.resource + '/list'
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Object.assign({
        page: 1,
        limit: 10,
        token: null,
        filters: []
      }, request || {}))
    }
    return promise(resource, options)
  }

  get(id, token) {
    var resource = this.resource + '/get/' + id + (token ? '/' + token : '')
    var options = {
      method: 'POST'
    }
    return promise(resource, options)
  }

  save(item, token) {
    delete item['__type']
    var resource = this.resource + '/save'
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        item: JSON.stringify(item),
        token: token
      })
    }
    return promise(resource, options)
  }

  remove(id, token = undefined) {
    var resource = this.resource + '/delete/' + id + (token ? '/' + token : '')
    var options = {
      method: 'POST',
      headers: headers
    }
    return promise(resource, options)
  }

  run(request) {
    var resource = this.resource + '/run'
    var options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(Object.assign({
        arguments: []
      }, request))
    }
    return promise(resource, options)
  }
}

export default RestService
