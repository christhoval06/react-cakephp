import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-bootstrap'
import { hideFilters } from '../../actions/Grid'
import { isFunction } from '../../system/Type'
import { FormattedMessage } from 'react-intl'
import Field from '../forms/fields/Field'

class Search extends Component {
  static propTypes = {
    data: React.PropTypes.array.isRequired,
    visible: React.PropTypes.bool.isRequired,
    filters: React.PropTypes.shape({
      title: React.PropTypes.string,
      items: React.PropTypes.object.isRequired
    }),
    onSubmit: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      data: props.data
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.data
    })
  }

  close() {
    const { dispatch } = this.props
    dispatch(hideFilters())
  }

  change(name, value) {
    const { filters } = this.props
    const { data } = this.state
    var item = data.find(d => d.key === name)
    if(!item) {
      data.push({
        key: name,
        name: filters.items[name].column || name,
        value: value,
        clause: filters.items[name].clause
      })
    }
    else {
      item.value = value
    }
    this.setState({ data: data })
  }

  reset() {
    this.setState({ data: [] })
  }

  submit() {
    const { data } = this.state
    this.props.onSubmit(data)
  }

  render() {
    const { visible, filters, auth } = this.props
    const { data } = this.state
    var validationErrors = []
    var title = filters.title || 'app.label.search'
    if (isFunction(title)) {
      title = title.apply(this)
    }
    title = this.props.intl.messages[title] || title

    return (
      <Modal show={visible}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(filters.items).map(name => {
            var field = Object.assign({}, filters.items[name], { name: name })
            var isInRole = !field.roles || field.roles.find(r => r === auth.role) != null
            if (!isInRole) {
              return null
            }
            var error = validationErrors.find(e => e.field === name) || null
            var filter = data.find(d => d.key === name)
            var value = filter ? filter.value : ''

            if (field.render != null) {
              return field.render.apply(this, [{
                item: data,
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
                  item={data}
                  field={field}
                  value={value}
                  validationError={error}
                  onChange={this.change.bind(this)}/>
              )
            }
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle='default' onClick={this.close.bind(this)}>
            <FormattedMessage id="app.label.close" />
          </Button>
          <Button bsStyle='danger' onClick={this.reset.bind(this)}>
            <FormattedMessage id="app.label.reset" />
          </Button>
          <Button bsStyle='primary' onClick={this.submit.bind(this)}>
            <FormattedMessage id="app.label.search" />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
function mapToStateProps(state) {
  return state
}
export default connect(mapToStateProps)(Search)
