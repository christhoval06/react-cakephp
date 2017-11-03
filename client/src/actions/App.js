export const SHOW_LOADER = 'APP_SHOW_LOADER'
export const HIDE_LOADER = 'APP_HIDE_LOADER'

export function showLoader() {
  return {
    type: SHOW_LOADER
  }
}
export function hideLoader() {
  return {
    type: HIDE_LOADER
  }
}
