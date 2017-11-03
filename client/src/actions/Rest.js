import RestService from '../middlewares/RestService'
import { showLoader, hideLoader } from './App'

export const REQUEST_LIST = 'REST_REQUEST_LIST'
export const RECEIVE_LIST = 'REST_RECEIVE_LIST'
export const REQUEST_SAVE = 'REST_REQUEST_SAVE'
export const RECEIVE_SAVE = 'REST_RECEIVE_SAVE'
export const REQUEST_SAVE_CLEAN = 'REST_REQUEST_SAVE_CLEAN'
export const REQUEST_LOAD = 'REST_REQUEST_LOAD'
export const RECEIVE_LOAD = 'REST_RECEIVE_LOAD'
export const REQUEST_CREATE = 'REST_REQUEST_CREATE'
export const REQUEST_REMOVE = 'REST_REQUEST_DELETE'
export const RECEIVE_REMOVE = 'REST_RECEIVE_DELETE'
export const REQUEST_GET = 'REST_REQUEST_GET'
export const RECEIVE_GET = 'REST_RECEIVE_GET'
export const REQUEST_RUN = 'REST_REQUEST_RUN'
export const RECEIVE_RUN = 'REST_RECEIVE_RUN'
export const REQUEST_RUN_CLEAN = 'REST_REQUEST_RUN_CLEAN'
export const RECEIVE_RUN_CLEAN = 'REST_RECEIVE_RUN_CLEAN'
export const RECEIVE_ERROR = 'REST_RECEIVE_ERROR'
export const REQUEST_ROW_FIELD_UPDATE = 'REST_REQUEST_ROW_FIELD_UPDATE'
export const REQUEST_ROW_FIELDS_UPDATE = 'REST_REQUEST_ROW_FIELDS_UPDATE'

function createService(resource) {
  return new RestService({ resource: resource })
}
export function updateRowFields(row, fields) {
  return {
    type: REQUEST_ROW_FIELDS_UPDATE,
    row: row,
    fields: fields 
  }
}
export function updateRowField(row, field, value) {
  return {
    type: REQUEST_ROW_FIELD_UPDATE,
    row: row,
    field: field,
    value: value
  }
}

export function requestSave(resource, item, token, args) {
  return {
    type: REQUEST_SAVE,
    item: item,
    token: token,
    args: args
  }
}
export function receiveSave(resource, item, token, args, response) {
  return {
    type: RECEIVE_SAVE,
    item: item,
    token: token,
    response: response,
    args: args
  }
}

export function requestSaveClean() {
  return {
    type: REQUEST_SAVE_CLEAN
  }
}

export function requestGet(resource, id, token, bindToProperty = 'item') {
  return {
    type: REQUEST_GET,
    id: id,
    token: token,
    bindToProperty: bindToProperty
  }
}

export function receiveGet(resource, id, token, response, bindToProperty) {
  return {
    type: RECEIVE_GET,
    id: id,
    token: token,
    response: response,
    bindToProperty: bindToProperty
  }
}

export function requestCreate(resource, bindToProperty = 'item') {
  return {
    type: REQUEST_CREATE,
    resource: resource,
    bindToProperty: bindToProperty
  }
}

export function requestList(resource, request, bindToProperty = 'list') {
  return {
    type: REQUEST_LIST,
    request: request,
    bindToProperty: bindToProperty
  }
}

export function receiveList(resource, request, response, bindToProperty) {
  return {
    type: RECEIVE_LIST,
    request: request,
    response: response,
    bindToProperty: bindToProperty
  }
}

export function requestLoad(resource, request, bindToProperty) {
  return {
    type: REQUEST_LOAD,
    request: request,
    bindToProperty: bindToProperty
  }
}

export function receiveLoad(resource, request, response, bindToProperty) {
  return {
    type: RECEIVE_LOAD,
    request: request,
    response: response,
    bindToProperty: bindToProperty
  }
}


export function requestRemove(resource, id, token) {
  return {
    type: REQUEST_REMOVE,
    id: id,
    token: token
  }
}
export function receiveRemove(resource, id, token, response) {
  return {
    type: RECEIVE_REMOVE,
    id: id,
    token: token,
    response: response
  }
}

export function requestRun(resource, request, bindToProperty) {
  return {
    type: REQUEST_RUN,
    resource: resource,
    request: request ,
    bindToProperty: bindToProperty
  }
}

export function receiveRun(resource, request, response, bindToProperty) {
  return {
    type: RECEIVE_RUN,
    resource: resource,
    request: request,
    response: response,
    bindToProperty: bindToProperty
  }
}

export function requestRunClean(item) {
  return {
    type: REQUEST_RUN_CLEAN,
    item: item
  }
}

export function receiveRunClean(item) {
  return {
    type: RECEIVE_RUN_CLEAN,
    item: item
  }
}

export function receiveError(error, args) {
  return {
    type: RECEIVE_ERROR,
    error: true,
    message: error.message,
    args
  }
}


export function clearRun(item) {
  return dispatch => {
    dispatch(receiveRunClean(item))
  }
}

export function clearSave() {
  return dispatch => {
    dispatch(requestSaveClean())
  }
}

export function run(resource, request, bindToProperty = 'batch') {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestRun(resource, request, bindToProperty))
    createService(resource)
      .run(request)
      .then(response => {
        dispatch(receiveRun(resource, request, response, bindToProperty))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(error, { resource, request, bindToProperty }))
        dispatch(hideLoader())
      })
  }
}

export function list(resource, request, bindToProperty = 'list') {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestList(resource, request, bindToProperty))
    createService(resource)
      .list(request)
      .then(response => {
        dispatch(receiveList(resource, request, response, bindToProperty))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(error, { resource, request, bindToProperty }))
        dispatch(hideLoader())
      })
  }
}

export function load(resource, request, bindToProperty) {
  return dispatch => {
    dispatch(requestLoad(resource, request, bindToProperty))
    createService(resource)
      .list(request)
      .then(response => {
        dispatch(receiveLoad(resource, request, response, bindToProperty))
      })
      .catch(error => {
        dispatch(receiveError(error, { resource, request, bindToProperty }))
      })
  }
}

export function get(resource, id, token, bindToProperty = 'item') {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestGet(resource, id, token, bindToProperty))
    createService(resource)
      .get(id, token)
      .then(response => {
        dispatch(receiveGet(resource, id, token, response, bindToProperty))
        dispatch(hideLoader())
      })
      .catch(error => dispatch(receiveError(error, { resource, id })))
  }
}

export function create(resource) {
  return dispatch => {
    dispatch(requestCreate(resource))
  }
}

export function remove(resource, id, token) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestRemove(resource, id, token))
    createService(resource)
      .remove(id, token)
      .then(response => {
        dispatch(receiveRemove(resource, id, token, response))
        dispatch(hideLoader())
      })
      .catch(error => dispatch(receiveError(error, { resource, id })))
  }
}

export function save(resource, item, token, args = null) {
  return dispatch => {
    dispatch(showLoader())
    dispatch(requestSave(resource, item, token, args))
    createService(resource)
      .save(item, token)
      .then(response => {
        dispatch(receiveSave(resource, item, token, args, response))
        dispatch(hideLoader())
      })
      .catch(error => {
        dispatch(receiveError(error, { resource, item, args }))
        dispatch(hideLoader())
      })
  }
}
