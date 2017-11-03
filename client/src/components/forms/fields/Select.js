import React from 'react'
import Field from './Field'
import {
  FormGroup,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../system/Type'

class Select extends Field {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ]),
    options: React.PropTypes.arrayOf(React.PropTypes.shape({
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      label: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ])
    })),
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired
  }

  change(evt) {
    const { field } = this.props
    this.props.onChange(field.name, evt.target.value)
  }

  render() {
    const { field, value, options, validationError } = this.props
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
      <FormGroup key={field.name} controlId={name} {...additionalProps}>
        <ControlLabel>{label}</ControlLabel>
        <select
          className='form-control'
          value={value}
          onChange={this.change.bind(this)}>
          {options.map(option =>
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )}
        </select>
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
      </FormGroup>
    )
  }
}

function mapToStateProps(state) {
  return {
    state
  }
}

export default connect(mapToStateProps)(Select)
