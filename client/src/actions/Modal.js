export const SHOW_MODAL = 'SHOW_MODAL'
export const HIDE_MODAL = 'HIDE_MODAL'

export function showModal(request = {
  title: "{request.title}",
  content: "{request.content}",
  buttons: []
}) {
  return {
    type: SHOW_MODAL,
    title: request.title,
    content: request.content,
    buttons: request.buttons
  }
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  }
}
