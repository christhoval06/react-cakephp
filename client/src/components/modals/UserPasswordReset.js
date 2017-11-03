import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Button
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reset, resetPassword } from '../../actions/User'
import Field from '../forms/fields/Field'

class UserPasswordReset extends Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      account: ''
    }

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible && nextProps.visible !== this.props.visible) {
      this.setState({
        account: ''
      })
    }
  }

  render() {
    const { visible, state } = this.props
    const { user } = state
    const { validationErrors } = user
    return (
      <Modal show={visible}>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id="app.label.reset_password" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Field
              key='account'
              name='account'
              field={{
                name: 'account',
                label: 'app.label.account'
              }}
              value={this.state.account}
              validationError={validationErrors.find(e => e.field === 'account')}
              onChange={(name, value) => this.setState({ [name]: value })}/>

          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={user.operationInProgress}
            bsStyle='warning'
            onClick={this.submit.bind(this)}>
            <FormattedMessage id="app.label.reset" />
          </Button>

          <Button
            disabled={user.operationInProgress}
            bsStyle='default'
            onClick={this.close.bind(this)}>
            <FormattedMessage id="app.label.close" />
          </Button>

        </Modal.Footer>
      </Modal>
    )
  }
  close() {
    const { dispatch } = this.props
    dispatch(reset())
  }
  submit() {
    const { dispatch } = this.props
    const { account } = this.state
    dispatch(resetPassword({ account }))
  }
}
export default connect(state => { return { state } })(UserPasswordReset)
