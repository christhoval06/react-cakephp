export const DEBUG = true
export const BASE_URL = "http://amazon.theappetize.com/"

export function endpoint(resource) {
  return BASE_URL + 'rest/' + resource
}
export function link(resource) {
  return BASE_URL + resource
}
