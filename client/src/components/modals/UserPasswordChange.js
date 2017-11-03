import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Button
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reset, changePassword } from '../../actions/User'
import Password from '../forms/fields/Password'

class UserPasswordChange extends Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      old_password: '',
      new_password: '',
      confirm_password: ''
    }

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible && nextProps.visible !== this.props.visible) {
      this.setState({
        old_password: '',
        new_password: '',
        confirm_password: ''
      })
    }
  }

  render() {
    const { visible, state } = this.props
    const { user } = state
    var fields = ['old_password', 'new_password', 'confirm_password']
    var errors = user.validationErrors || []
    return (
      <Modal show={visible}>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id="app.label.change_password" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {fields.map(field =>
              <Password
                key={field}
                name={field}
                field={{
                  name: field,
                  label: 'app.label.' + field
                }}
                value={this.state[field]}
                validationError={errors.find(e => e.field === field)}
                onChange={(name, value) => this.setState({ [name]: value })}/>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={user.operationInProgress}
            bsStyle='default'
            onClick={this.close.bind(this)}>
            <FormattedMessage id="app.label.close" />
          </Button>
          <Button
            disabled={user.operationInProgress}
            bsStyle='primary'
            onClick={this.submit.bind(this)}>
            <FormattedMessage id="app.label.update" />
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
    const { dispatch, state } = this.props
    const { auth } = state
    const { token } = auth

    let request = {
      token: token,
      old_password: this.state.old_password,
      new_password: this.state.new_password,
      confirm_password: this.state.confirm_password
    }
    dispatch(changePassword(request))
  }
}
function mapToStateProps(state) {
  return {
    state
  }
}

export default connect(mapToStateProps)(UserPasswordChange)
