export const PUSH = 'ROUTER_PUSH'
export const OPEN = 'ROUTER_OPEN'

export function push(route) {
  return {
    type: PUSH,
    route: route
  }
}

export function open(link) {
  document.location = link
  return {
    type: OPEN,
    link: link
  }
}
