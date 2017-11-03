import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap'
import { isFunction } from '../../../system/Type'
import { FormattedMessage } from 'react-intl'

class Textarea extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.object
    ]),
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
        <ControlLabel>{label}</ControlLabel>
        <FormControl componentClass="textarea" rows={3} value={value} onChange={this.change.bind(this)}/>
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
export default connect(mapToStateProps)(Textarea)
