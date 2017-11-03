import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  FormGroup,
  ControlLabel,
  HelpBlock,
  Table
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../../system/Type'
import s from 'underscore.string'

var PROPS = [
  'type',
  'name',
  'surname',
  'fiscal_code',
  'address',
  'zip_code',
  'vat_number',
  'province_name',
  'city_name',
  'birth_city_name',
  'country_name'
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
    const { field, value } = this.props
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
    const { field, value, validationError } = this.props
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
            {PROPS.map((prop, index) =>
              <tr key={index}>
                <td style={{ paddingLeft: 0, width: 220 }}>
                  <ControlLabel style={{ paddingTop: 6 }}>
                    {s(prop.split('_').join(' ')).capitalize().value()}
                  </ControlLabel>
                </td>
                <td style={{ paddingRight: 0 }}>
                  {value[prop] || ''}
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
      </FormGroup>
    )
  }
}

export default connect(state => { return { state }})(Props)
