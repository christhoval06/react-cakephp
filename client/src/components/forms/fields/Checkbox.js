import { connect } from 'react-redux'
import React from 'react'
import Field from './Field'
import {
  FormGroup,
  Checkbox as BsCheckbox,
  HelpBlock
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../system/Type'
import { parseBool } from '../../../system/Bool'

class Checkbox extends Field {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.bool
    ]),
    help: React.PropTypes.string,
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired
  }

  change(evt) {
    const { field, value } = this.props
    var b = parseBool(value)
    this.props.onChange(field.name, !b)
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
        <BsCheckbox checked={parseBool(value)} onChange={this.change.bind(this)}>{label}</BsCheckbox>
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
export default connect(mapToStateProps)(Checkbox)
