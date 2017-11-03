import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Button,
  Panel,
  Breadcrumb,
  PageHeader
}
from 'react-bootstrap'
import Field from './fields/Field'
import { endpoint } from '../../config'
import { save } from '../../actions/Rest'
import { updateField } from '../../actions/Form'
import { push } from '../../actions/Router'
import { isFunction } from '../../system/Type'
import { FormattedMessage } from 'react-intl'
import Notifications from 'react-notification-system-redux'
import s from 'underscore.string'

class Form extends Component {
  static propTypes = {
    descriptor: React.PropTypes.shape({
      form: React.PropTypes.object.isRequired
    }),
    resource: React.PropTypes.string.isRequired,
    token: React.PropTypes.string,
    item: React.PropTypes.object,
    validationErrors: React.PropTypes.arrayOf(React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.any.isRequired
    }))
  }

  componentDidMount() {
    const { descriptor } = this.props
    if (descriptor.form && descriptor.form.didMount) {
      descriptor.form.didMount.apply(this)
    }
  }

  componentDidUpdate(nextProps, nextState) {
    const { descriptor } = this.props
    if (descriptor.form && descriptor.form.didUpdate) {
      descriptor.form.didUpdate.apply(this)
    }
  }

  componentWillUpdate(nextProps) {
    const { dispatch, save, resource, state } = nextProps
    const { intl } = state
    if (save != null && save.valid) {
      dispatch(Notifications.success({
        title: intl.messages['app.notification.save.title'],
        message: intl.messages['app.notification.save.message'],
        position: 'br',
        autoDismiss: 5,
        dismissible: false
      }))
      dispatch(push('/' + resource + '/grid'))
    }
  }



  submit() {
    const { dispatch, resource, item, token } = this.props
    dispatch(save(endpoint(resource), item, token))
  }

  change(name, value) {
    const { dispatch, item } = this.props
    dispatch(updateField(item, name, value))
  }

  render() {
    const { resource, item, validationErrors, state, descriptor } = this.props
    const { form } = descriptor
    const { auth } = state

    var title = resource
    if (form.title) {
      if (item.id && item.id > 0) {
        title = form.title.modify
      }
      else {
        title = form.title.create
      }
    }
    if(isFunction(title)) {
      title = title.apply(this)
    }
    else {
      title = (
        <FormattedMessage
          id={title}
          defaultMessage={title} />
      )
    }
    var breadcrumbTitle = null
    if (descriptor.name) {
      if(isFunction(descriptor.name)) {
        breadcrumbTitle = descriptor.name.apply(this)
      }
      else {
        breadcrumbTitle = (
          <FormattedMessage
            id={descriptor.name}
            defaultMessage={descriptor.name} />
        )
      }
    }
    else {
      breadcrumbTitle = s(resource).capitalize().value()
    }
    return (
      <div>
        <PageHeader>{title}</PageHeader>
        <Breadcrumb>
          {descriptor.form.breadcrumbs && descriptor.form.breadcrumbs.length > 0 &&
            descriptor.form.breadcrumbs.map((breadcrumb, index) =>
              <Breadcrumb.Item key={index} href={breadcrumb.link} {...breadcrumb.props}>
                <FormattedMessage id={breadcrumb.label} />
              </Breadcrumb.Item>
            )
          }
          {!descriptor.form.breadcrumbs &&
            <Breadcrumb.Item href="#">
              <FormattedMessage
                id='app.grid.breadcrumb.table'
                defaultMessage='Table' />
            </Breadcrumb.Item>
          }
          {!descriptor.form.breadcrumbs &&
            <Breadcrumb.Item href={'#/' + resource + '/grid'}>{breadcrumbTitle}</Breadcrumb.Item>
          }
          {!descriptor.form.breadcrumbs &&
            <Breadcrumb.Item active>
              <FormattedMessage
                id='app.grid.breadcrumb.form'
                defaultMessage='Form' />
            </Breadcrumb.Item>
          }
        </Breadcrumb>
        <Panel header={breadcrumbTitle}>
          <form>
            {Object.keys(form.fields).map(name => {
              var field = Object.assign({}, form.fields[name], { name: name })
              var isInRole = !field.roles || field.roles.find(r => r === auth.role) != null
              if (!isInRole) {
                return null
              }
              var error = validationErrors.find(e => e.field === name) || null
              var value = item[name] || ''
              if (field.render != null) {
                return field.render.apply(this, [{
                  item: item,
                  field: field,
                  value: value,
                  validationError: error,
                  onChange: this.change.bind(this)
                }])
              }
              else {
                return (
                  <Field
                    key={name}
                    item={item}
                    field={field}
                    value={value}
                    validationError={error}
                    onChange={this.change.bind(this)}/>
                )
              }
            })}
            <hr />
            <Button type="button" bsSize="lg" bsStyle="primary" onClick={this.submit.bind(this)}>
              <FormattedMessage
                id='app.form.button.save'
                defaultMessage='app.form.button.save' />
            </Button>
          </form>
        </Panel>
        <br />
      </div>
    )
  }
}
function mapToStateProps(state) {
  return {
    state
  }
}
export default connect(mapToStateProps)(Form)
