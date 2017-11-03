import React, { Component } from 'react'
import {
  Modal,
  ProgressBar
}
from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'

class Loader extends Component {
  static propTypes = {
    show: React.PropTypes.bool.isRequired
  }
  render() {
    const { show } = this.props
    return (
      <Modal show={show}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FormattedMessage id="app.label.loading" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar active now={100} />
        </Modal.Body>
      </Modal>
    )
  }
}
export default connect(state => state )(Loader)
