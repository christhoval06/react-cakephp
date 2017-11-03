import React, { Component } from 'react'
import DateTime from 'react-datetime'
import { connect } from 'react-redux'
import { FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../system/Type'
import moment from 'moment'
import { isNullOrEmpty } from '../../../system/String'

class Date extends Component {
  static propTypes = {
    format: React.PropTypes.string,
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.any,
    onChange: React.PropTypes.func.isRequired
  }
  change(value) {
    const { field } = this.props
    this.props.onChange(field.name, value ? value.format() : '')
  }
  render() {
    const { state } = this.props
    const { intl } = state
    const { field, format, value, validationError } = this.props
    var additionalProps = {}
    if (validationError != null) {
      additionalProps.validationState = 'error'
    }
    var label = field.label
    if (label && label !== false) {
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
    }
    else {
      label = null
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
    var date = value
    if (!isNullOrEmpty(value)) {
      date = moment(value).format(format)
    }
    return (
      <FormGroup key={field.name} controlId={field.name} {...additionalProps}>
        {label && label !== null && <ControlLabel>{label}</ControlLabel>}
        <DateTime
          locale={intl.locale}
          value={date}
          dateFormat={format}
          timeFormat={false}
          onChange={this.change.bind(this)} />
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
      </FormGroup>
    )
  }
}

function mapToStateProps(state) {
  return { state }
}

export default connect(mapToStateProps)(Date)
