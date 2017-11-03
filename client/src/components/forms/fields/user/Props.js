import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Table,
  Alert
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../../system/Type'
import s from 'underscore.string'

let PROPS = [
  'referal_code',
  'referal_source',
  'referal_status',
  'referal_first_payment_commission',
  'referal_next_payments_commission',
  'prefered_lang',
  'network_name',
  'network_url_whitelist',
  'network_reference'
]

class Props extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    help: React.PropTypes.string,
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired
  }

  change(name, evt) {
    const { field } = this.props
    var value = this.props.value || []
    var prop = value.find(p => p.name === name)
    if (prop) {
      prop.value = evt.target.value
    }
    else {
      value.push({
        name: name,
        value: evt.target.value
      })
    }

    this.props.onChange(field.name, value)
  }

  render() {
    const { field, validationError } = this.props
    var value = this.props.value || []
    var additionalProps = {}
    if (validationError != null) {
      additionalProps.validationState = 'error'
    }
    var label = field.label
    if (isFunction(label)) {
      label = label.apply(this)
    }
    else {
      label = (
        <FormattedMessage
          id={label}
          defaultMessage={label} />
      )
    }
    var help = field.help
    if (help) {
      if (isFunction(help)) {
        help = help.apply(this)
      }
      else {
        help = (
          <FormattedMessage
            id={help}
            defaultMessage={help} />
        )
      }
    }
    var items = []
    if (value) {
      items = items.concat(value)
    }

    items = items.concat(PROPS.filter(p => items.find(i => i.name === p) == null).map(prop => {
      return {
        name: prop,
        value: ''
      }
    })).sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })

    return (
      <FormGroup controlId={field.name} {...additionalProps}>
        <Table responsive condensed>
          <thead>
            <tr>
              <th style={{ paddingLeft: 0 }}>{label}</th>
              <th><FormattedMessage id="app.label.value" /></th>
            </tr>
          </thead>
          <tbody>
            {items.map((prop, index) =>
              <tr key={index}>
                <td style={{ paddingLeft: 0, width: 220 }}>
                  <ControlLabel style={{ paddingTop: 6 }}>
                    {s(prop.name.split('_').join(' ')).capitalize().value()}
                  </ControlLabel>
                </td>
                <td style={{ paddingRight: 0 }}>
                  <FormControl
                    type="text"
                    bsSize="sm"
                    value={prop.value}
                    onChange={this.change.bind(this, prop.name)}/>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {(!value || value.length === 0) &&
          <Alert bsStyle="info">
            <FormattedMessage id="app.label.no_records" />
          </Alert>
        }
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
      </FormGroup>
    )
  }
}

export default connect(state => { return { state }})(Props)
