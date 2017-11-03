import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Alert,
  Button,
  Panel,
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'
import { login } from '../actions/Auth'
import { push } from '../actions/Router'
import { getStatus } from '../actions/Subscription'
import { askToResetPassword } from '../actions/User'
import { FormattedMessage } from 'react-intl'
import ModalPresentator from '../components/modals/Presentator'
import logo from '../logo.png'

class LoginPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      errors: { }
    }
  }
  componentDidMount() {
    const { dispatch, state } = this.props
    const { auth } = state
    if (!auth.error && auth.token != null) {
      dispatch(push("/"))
    }
  }
  componentWillUpdate(nextProps) {
    const { dispatch, state } = nextProps
    const { auth } = state
    if (!auth.error && auth.token != null) {
      dispatch(push("/"))
      dispatch(getStatus({ token: auth.token }))
    }
  }

  render() {
    const { errors } = this.state
    var usernameControlProps = {}
    var passwordControlProps = {}
    if (errors.username) {
      usernameControlProps.validationState = 'error'
    }
    if (errors.password) {
      passwordControlProps.validationState = 'error'
    }
    const { auth } = this.props.state
    return (
      <Grid fluid>
        <Row>
          <Col
            lg={4}
            md={4}
            sm={8}
            xs={12}
            lgOffset={4}
            mdOffset={4}
            smOffset={2}
            className="login">
            <Panel header={
                <div>
                  <img src={logo} role="presentation" width="20px"/>
                  {' '}
                  <FormattedMessage id="app.label.login" />
                </div>
              } bsStyle='default' className="animated fadeInDown">
              <form>
                <FormGroup controlId='username' {...usernameControlProps}>
                  <ControlLabel>
                    <FormattedMessage id="app.label.username" />
                  </ControlLabel>
                  <FormControl
                    type="text"
                    value={this.state.username}
                    onChange={(evt) => this.setState({ username: evt.target.value })} />
                  {this.state.errors.username &&
                    <HelpBlock>
                      {this.state.errors.username}
                    </HelpBlock>}
                </FormGroup>
                <FormGroup controlId='password' {...passwordControlProps}>
                  <ControlLabel>
                    <FormattedMessage id="app.label.password" />
                  </ControlLabel>
                  <FormControl
                    type="password"
                    value={this.state.password}
                    onChange={(evt) => this.setState({ password: evt.target.value })}/>
                  {this.state.errors.password && <HelpBlock>{this.state.errors.password}</HelpBlock>}
                </FormGroup>
                <br />
                <Row>
                  <Col xs={12} className="text-right">
                    <Button
                      bsStyle='warning'
                      disabled={auth.processing}
                      onClick={this.reset.bind(this)}>
                      <FormattedMessage id="app.label.password_lost" />
                    </Button>
                    {' '}
                    <Button
                      bsStyle='danger'
                      disabled={auth.processing}
                      onClick={this.login.bind(this)}>
                      <FormattedMessage id="app.label.login" />
                    </Button>
                  </Col>
                </Row>
              </form>
            </Panel>
            {auth && auth.error &&
              <Alert
                bsStyle='warning'
                className="animated fadeIn">
                {auth.message}
              </Alert>
            }
            <ModalPresentator />
          </Col>
        </Row>
      </Grid>
    )
  }

  login() {
    const { username, password } = this.state
    var errors = { }
    if (username === null || username.length === 0) {
      errors.username = (<FormattedMessage id="app.label.required" />)
    }
    if (password === null || password.length === 0) {
      errors.password = (<FormattedMessage id="app.label.required" />)
    }
    if (errors.username || errors.password) {
      this.setState({ errors: errors })
    }
    else {
      this.setState({ errors: { } })
      const { dispatch } = this.props
      dispatch(login(username, password))
    }
  }

  reset() {
    const { dispatch } = this.props
    dispatch(askToResetPassword())
  }

}
function mapToStateProps(state) {
  const { auth } = state
  return {
    state: Object.assign(state, {
      auth: Object.assign(auth, {
        username: localStorage.getItem('username'),
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role')
      })
    })
  }
}
export default connect(mapToStateProps)(LoginPage)
