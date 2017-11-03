import React, { Component } from 'react'
import { Alert } from 'react-bootstrap'
import { connect } from 'react-redux'
import { endpoint } from '../config'
import { get, create } from '../actions/Rest'
import { createItem } from '../actions/Form'
import descriptors from '../descriptors'
import Form from './forms/Form'
import Notifications from 'react-notification-system-redux'

class FormPage extends Component {

  componentDidMount() {
    const { dispatch, params, state } = this.props
    const { resource, action, id } = params
    const { auth } = state
    const { token } = auth

    dispatch(createItem())
    if(action === 'edit') {
      dispatch(get(endpoint(resource), id, token))
    }
    else {
      dispatch(create(resource))
    }

    this.resource = resource
  }

  componentDidUpdate(prevProps, prevState) {
    const { dispatch, params, state } = this.props
    const { rest, intl } = state
    const { save } = rest
    const { resource } = params
    if (resource !== this.resource) {
      this.resource = resource
      this.refresh()
    }
    if (save && save !== this._lastSave) {
      this._lastSave = save
      if (save && save.error) {
        dispatch(Notifications.error({
          title: intl.messages['app.notification.error.title'],
          message: intl.messages['app.notification.error.message'] + '\n' + save.message,
          position: 'br',
          autoDismiss: 5,
          dismissible: false
        }))
      }
      if(save && !save.valid) {
        dispatch(Notifications.warning({
          title: intl.messages['app.notification.save.invalid.title'],
          message: intl.messages['app.notification.save.invalid.message'],
          position: 'br',
          autoDismiss: 5,
          dismissible: false
        }))
      }
    }
  }


  render() {
    const { state } = this.props
    const { rest, form, auth } = state
    const { params } = this.props
    const { resource, action } = params
    const { token } = auth
    const { save } = rest

    var item = rest.item || {}
    var data = Object.assign(item, form.item || { })
    var validationErrors = rest.save && rest.save != null ? rest.save.errors || [] : []


    if (item.error) {
      return (
        <Alert bsStyle='danger'>{item.message}</Alert>
      )
    }


    let descriptor = descriptors[resource]
    if (!descriptor) {
      return (
        <Alert bsStyle='danger'>
          No descriptor found for resource: {resource}
        </Alert>
      )
    }

    if (!descriptor.form) {
      return (
        <Alert bsStyle='danger'>
          No form descriptor found for resource: {resource}
        </Alert>
      )
    }

    if (descriptor.form.events && descriptor.form.events[action]) {
      data = descriptor.form.events[action](data)
    }
    var formControl = null
    if (descriptor.form.render) {
      formControl = descriptor.form.render.apply(this, [{
        resource: resource,
        descriptor: descriptor,
        token: token,
        item: data,
        save: save,
        validationErrors: validationErrors
      }])
    }
    else {
      formControl = (
        <Form
          resource={resource}
          descriptor={descriptor}
          token={token}
          item={data}
          save={save}
          validationErrors={validationErrors} />
      )
    }
    return (
      <div>
        {rest && rest.error && <br />}
        {rest && rest.error &&
          <Alert bsStyle="danger" className="animated fadeIn">
            {rest.message}
          </Alert>
        }
        {formControl}
      </div>
    )
  }
}
function mapToStateProps(state) {
  const { rest, form } = state
  return {
    state,
    rest: Object.assign({
      item: { }
    }, rest || {}),
    form: Object.assign({
      item: { }
    }, form || {})
  }
}

export default connect(mapToStateProps)(FormPage)
