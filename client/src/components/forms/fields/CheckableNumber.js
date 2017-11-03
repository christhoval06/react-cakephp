import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  InputGroup
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { isFunction } from '../../../system/Type'
import { FormattedMessage } from 'react-intl'

class CheckableNumber extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string,
      React.PropTypes.object
    ]),
    help: React.PropTypes.string,
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      checked: props.value > 0
    }
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
    var labelAfter = field.labelAfter
    if (labelAfter) {
      if (isFunction(labelAfter)) {
        labelAfter = labelAfter.apply(this)
      }
      else {
        labelAfter = (
          <FormattedMessage
            id={labelAfter}
            defaultMessage={labelAfter} />
        )
      }
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
        <InputGroup>
          <InputGroup.Addon>
            <input
              type="checkbox"
              checked={this.state.checked}
              onChange={this.toggle.bind(this)} />
          </InputGroup.Addon>
          <FormControl
            type="number"
            readOnly={!this.state.checked}
            value={value}
            onChange={this.change.bind(this)} />
          {labelAfter && <InputGroup.Addon>{labelAfter}</InputGroup.Addon>}
        </InputGroup>
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError}</HelpBlock>}
      </FormGroup>
    )
  }

  toggle() {
    const { field } = this.props
    var checked = !this.state.checked
    var value = 0
    if (checked) {
      value = 1
    }
    this.setState({ checked: checked })
    this.props.onChange(field.name, value)
  }

  change(evt) {
    const { field } = this.props
    this.props.onChange(field.name, evt.target.value)
  }
}

function mapToStateProps(state) {
  return {
    state
  }
}

export default connect(mapToStateProps)(CheckableNumber)
