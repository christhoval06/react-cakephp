export function promise(resource, options) {
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
export const headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}
