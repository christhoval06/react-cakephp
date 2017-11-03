import {
  SHOW_MODAL,
  HIDE_MODAL
}
from '../actions/Modal'

function modal(state = {
  show: false,
  title: null,
  content: null,
  buttons: []
}, action) {
  switch(action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, {
        show: true,
        title: action.title,
        content: action.content,
        buttons: action.buttons
      })
    case HIDE_MODAL:
      return Object.assign({}, state, {
        show: false
      })
    default:
      return state
  }
}

export default modal
