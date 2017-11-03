import {
  UPDATE_FIELD,
  CREATE_ITEM
} from '../actions/Form'

function form(state = {}, action) {
  switch(action.type) {
    case UPDATE_FIELD:
      return Object.assign({}, state, {
        item: action.update
          ? action.update(action.item, action.name, action.value)
          : Object.assign({}, action.item, {
            [action.name]: action.value
          })
      })
    case CREATE_ITEM:
      return Object.assign({}, state, {
        item: action.item
      })
    default:
      return state
  }
}

export default form
