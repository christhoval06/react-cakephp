import React, { Component } from 'react'
import { connect } from 'react-redux'
import Codemirror from 'react-codemirror'
import {
  FormGroup,
  ControlLabel,
  HelpBlock
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isNullOrEmpty } from '../../../system/String'
import { isFunction } from '../../../system/Type'
require('codemirror/mode/htmlmixed/htmlmixed')

class HtmlEditor extends Component {
  static propTypes = {
    item: React.PropTypes.object.isRequired,
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.string,
    validationError: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      checked: !isNullOrEmpty(props.value)
    }
  }

  render() {
    const { validationError, field, value } = this.props
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
    var options = {
			lineNumbers: true,
			mode: "htmlmixed"
		}
    return (
      <FormGroup controlId={field.name} {...additionalProps}>
        <ControlLabel>{label}</ControlLabel>
        <Codemirror value={value} onChange={(html) => this.updateValue(html)} options={options} />
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
      </FormGroup>
    )
  }

  updateValue(html) {
    const { field } = this.props
    const { name } = field
    this.props.onChange(name, html)
  }
}
function mapToStateProps(state) {
  return {
    state
  }
}
export default connect(mapToStateProps)(HtmlEditor)
