import {
  REQUEST_LIST,
  RECEIVE_LIST,
  REQUEST_LOAD,
  RECEIVE_LOAD,
  REQUEST_CREATE,
  REQUEST_REMOVE,
  RECEIVE_REMOVE,
  REQUEST_GET,
  RECEIVE_GET,
  REQUEST_RUN,
  RECEIVE_RUN,
  REQUEST_RUN_CLEAN,
  RECEIVE_RUN_CLEAN,
  REQUEST_SAVE,
  RECEIVE_SAVE,
  REQUEST_SAVE_CLEAN,
  RECEIVE_ERROR,
  REQUEST_ROW_FIELD_UPDATE,
  REQUEST_ROW_FIELDS_UPDATE
} from '../actions/Rest'

function rest(state = {
  loading: false,
  load: {},
  list: null,
  item: null,
  save: null
}, action) {
  switch(action.type) {
    case REQUEST_GET:
      return Object.assign({}, state, {
        save: null,
        loading: true,
        [action.bindToProperty]: null
      })
    case RECEIVE_GET:
      return Object.assign({}, state, {
        save: null,
        loading: false,
        [action.bindToProperty]: action.response.item
      })
    case REQUEST_RUN:
      return Object.assign({}, state, {
        run: Object.assign(state.run || {}, {
          [action.bindToProperty]: null
        })
      })
    case RECEIVE_RUN:
      return Object.assign({}, state, {
        run: Object.assign(state.run || {}, {
          [action.bindToProperty]: action.response
        })
      })
    case REQUEST_RUN_CLEAN:
    case RECEIVE_RUN_CLEAN:
      return Object.assign({}, state, {
        run: Object.assign(state.run || {}, {
          [action.item]: null
        })
      })
    case REQUEST_SAVE_CLEAN:
      return Object.assign({}, state, {
        save: null
      })
    case REQUEST_CREATE:
      return {
        load: {},
        save: null,
        [action.bindToProperty]: null
      }
    case REQUEST_LIST:
      return Object.assign({}, state, {
        loading: true,
        [action.bindToProperty]: Object.assign({}, state[action.bindToProperty], {
          request: action.request
        })
      })
    case RECEIVE_LIST:
      return Object.assign({}, state, {
        loading: false,
        [action.bindToProperty]: Object.assign(action.response, {
          request: action.request
        })
      })
    case REQUEST_LOAD:
      return Object.assign({}, state, {
        load: Object.assign(state.load || {}, {
          [action.bindToProperty]: {
            loading: true,
            rows: [],
            count: 0
          }
        })
      })
    case RECEIVE_LOAD:
      return Object.assign({}, state, {
        load: Object.assign(state.load || {}, {
          [action.bindToProperty]: action.response
        })
      })
    case REQUEST_REMOVE:
      return Object.assign({}, state, {
        id: action.id,
        loading: true
      })
    case RECEIVE_REMOVE:
      var list = state.list || { rows: [], count: 0 }
      return Object.assign({}, state, {
        loading: false,
        list: Object.assign(list, {
          error: action.response.error,
          message: action.response.message,
          count: action.response.error ? list.count : list.count -1,
          rows: list.rows.map(r => {
            if (r.id === action.id) {
              r.deleted = true
            }
            return r
          })
        }),
        id: action.id
      })
    case REQUEST_SAVE:
      return Object.assign({}, state, {
        loading: true,
        item: action.item,
        save: null
      })
    case RECEIVE_SAVE:
      if (action.response.args) {
        console.warn("Save response contains 'args' field that will be overridden by action.args")
      }
      return Object.assign({}, state, {
        loading: false,
        item: action.item,
        save: Object.assign(action.response, {
          args: action.args
        })
      })
    case RECEIVE_ERROR:
      return Object.assign({}, state, {
        loading: false,
        error: action.error,
        message: action.message,
        args: action.args
      })
    case REQUEST_ROW_FIELD_UPDATE:
      var rows = state.list.rows.map(r => {
        if (r === action.row) {
          r[action.field] = action.value
        }
        return r
      })
      return Object.assign({}, state, {
        list: Object.assign(state.list, {
          rows: rows
        })
      })
    case REQUEST_ROW_FIELDS_UPDATE:
      return Object.assign({}, state, {
        list: Object.assign(state.list, {
          rows: state.list.rows.map(r => {
            if (r === action.row) {
              Object.keys(action.fields).forEach(field => {
                r[field] = action.fields[field]
              })
            }
            return r
          })
        })
      })
    default:
      return state
  }
}

export default rest
