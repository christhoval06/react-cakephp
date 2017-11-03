import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Navbar as BsNavbar,
  Nav,
  NavDropdown,
  MenuItem
}
from 'react-bootstrap'
import { logout } from '../actions/Auth'
import { askToChangePassword, getProfile } from '../actions/User'
import { FormattedMessage } from 'react-intl'
import logo from '../logo.png'
class Navbar extends Component {

  render() {
    const { state } = this.props
    const { auth } = state
    return (
      <BsNavbar inverse fluid fixedTop>
        <BsNavbar.Header>
          <BsNavbar.Brand>
            <a
              href="#/console"
              style={{ color: 'white' }}>
              <img
                src={logo}
                role="presentation"
                width="25"
                className="pull-left"
                style={{ marginRight: '10px', marginTop: '-2px' }}/>
              <FormattedMessage id='app.name' />
            </a>
          </BsNavbar.Brand>
        </BsNavbar.Header>
        <BsNavbar.Collapse>
          <Nav pullRight>
            <NavDropdown title={auth.username || 'Anonymous'} id="user-menu">
              <MenuItem onClick={this.logout.bind(this)}>
                <FormattedMessage id='app.label.logout' />
              </MenuItem>
              <MenuItem onClick={this.changeProfile.bind(this)}>
                <FormattedMessage id="app.label.change_profile" />
              </MenuItem>
              <MenuItem onClick={this.changePassword.bind(this)}>
                <FormattedMessage id="app.label.change_password" />
              </MenuItem>
            </NavDropdown>
          </Nav>
        </BsNavbar.Collapse>
      </BsNavbar>
    )
  }

  logout() {
    const { dispatch, state } = this.props
    const { auth } = state
    dispatch(logout(auth.token))
  }
  changePassword() {
    const { dispatch } = this.props
    dispatch(askToChangePassword())
  }
  changeProfile() {
    const { dispatch, state } = this.props
    const { auth } = state
    const { token } = auth
    dispatch(getProfile({ token }))
  }
}

function mapToStateProps(state) {
  return { state }
}

export default connect(mapToStateProps)(Navbar)
