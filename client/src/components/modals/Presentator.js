import React, { Component } from 'react'
import UserPasswordChange from './UserPasswordChange'
import UserPasswordReset from './UserPasswordReset'
import UserProfile from './UserProfile'
import { connect } from 'react-redux'

class Presentator extends Component {
  render() {
    const { state } = this.props
    const { user } = state
    return (
      <div>
        <UserPasswordChange visible={user && user.shouldChangePassword} />
        <UserPasswordReset visible={user && user.shouldResetPassword} />
        <UserProfile
          visible={user && user.shouldChangeProfile}
          profile={user.profile} />
      </div>
    )
  }
}

function mapToStateProps(state) {
  return {
    state
  }
}

export default connect(mapToStateProps)(Presentator)
