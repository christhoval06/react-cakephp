export const SHOW_FILTERS = 'GRID_SHOW_FILTERS'
export const HIDE_FILTERS = 'GRID_HIDE_FILTERS'

export function showFilters() {
  return {
    type: SHOW_FILTERS
  }
}
export function hideFilters() {
  return {
    type: HIDE_FILTERS
  }
}
