export const UPDATE_FIELD = 'FORM_UPDATE_FIELD'
export const CREATE_ITEM = 'FORM_CREATE'

export function updateField(item, fieldName, newValue, update) {
  return {
    type: UPDATE_FIELD,
    item: item,
    name: fieldName,
    value: newValue,
    update: update
  }
}

export function createItem() {
  return {
    type: CREATE_ITEM,
    item: {}
  }
}
