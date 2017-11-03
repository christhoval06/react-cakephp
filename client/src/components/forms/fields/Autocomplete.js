import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  FormGroup,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap'
import Select from 'react-select'
import { isFunction } from '../../../system/Type'
import { FormattedMessage } from 'react-intl'

class Autocomplete extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.object
    ]),
    options: React.PropTypes.array,
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired,
    onInputChange: React.PropTypes.func
  }

  change(option) {
    const { field } = this.props
    this.props.onChange(field.name, option != null ? option.value : '', option)
  }

  onInputChange(newValue) {
    this.__lastValue = newValue
    setTimeout(() => {
      if (newValue === this.__lastValue) {
        if (this.props.onInputChange) {
          this.props.onInputChange(newValue)
        }
      }
    }, 500)    
  }

  render() {
    const { field, value, validationError, options } = this.props
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
        <ControlLabel>{label}</ControlLabel>
        <Select
          key={name}
          name={name}
          value={value ? value.toString() : ""}
          options={options}
          onInputChange={this.onInputChange.bind(this)}
          onChange={this.change.bind(this)}
        />
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
export default connect(mapToStateProps)(Autocomplete)
