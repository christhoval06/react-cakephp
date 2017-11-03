import React, { Component } from 'react'
import {
  Modal,
  Button
}
from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

class MessageBox extends Component {
  static propTypes: {
    intl: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool.isRequired,
    size: React.PropTypes.string,
    title: React.PropTypes.string,
    buttons: React.PropTypes.array,
    content: React.PropTypes.any
  }

  render() {
    const { intl, show, size, title, buttons, content } = this.props
    return (
      <Modal show={show} bsSize={size}>
        <Modal.Header>
          <Modal.Title>{intl.messages[title]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {content}
        </Modal.Body>
        <Modal.Footer>
          {buttons.map((button, index) =>
            <Button
              key={index}
              onClick={() => button.click()}
              bsStyle={button.style}>
              <FormattedMessage id={button.label} />
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    )
  }
}

export default connect(state => state)(MessageBox)
