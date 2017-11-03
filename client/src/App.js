import React, { Component } from 'react'
import {
  Grid,
  Row,
  Col
}
from 'react-bootstrap'
import { connect } from 'react-redux'
import Notifications from 'react-notification-system-redux'
import { push } from './actions/Router'
import { validate as validateToken } from './actions/Auth'
import { getStatus } from './actions/Subscription'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ModalPresentator from './components/modals/Presentator'
import SubscriptionAlert from './components/alerts/Subscription'
import Loader from './components/Loader'
import MessageBox from './components/modals/MessageBox'

class App extends Component {
  componentDidMount() {
    const { dispatch, auth } = this.props
    if (!auth || !auth.token || auth.token == null) {
      dispatch(push('/login'))
    }
    else {
      dispatch(validateToken(auth.token))
    }
    var interval = setInterval(() => {
      const { subscription, auth } = this.props
      const { status } = subscription
      const { token } = auth
      if (status === 'activated') {
        dispatch(getStatus({ token }))
      }
      else {
        clearInterval(interval)
      }
    }, 20000)
  }

  componentWillUpdate(nextProps) {
    const { dispatch, auth } = this.props
    if (!auth || !auth.token || auth.token == null) {
      dispatch(push('/login'))
    }
    else {
      const { subscription } = this.props
      if (subscription.status === null) {
          dispatch(getStatus({ token: auth.token }))
      }
    }
  }

  render() {
    const { app, notifications, location, modal, subscription } = this.props
    const { pathname } = location
    let commonStyle = {
      border: '0px'
    }
    const style = {
      NotificationItem: {
        DefaultStyle: {
          marginRight: '20px'
        },
        success: commonStyle,
        warning: commonStyle,
        error: commonStyle,
        info: commonStyle
      }
    }
    return (
      <div>
        <Navbar />
        <Grid fluid className="wrapper">
          <Row>
            <Col
              lg={2}
              md={2}
              smHidden={true}
              xsHidden={true}
              className="sidebar" >
              <Sidebar pathname={pathname} />
            </Col>
            <Col
              lg={10}
              md={10}
              sm={12}
              xs={12}
              lgOffset={2}
              mdOffset={2}
              className="spa">
              <SubscriptionAlert subscription={subscription} />
              {this.props.children}
            </Col>
          </Row>
          <MessageBox
            show={modal.show}
            size={modal.size}
            title={modal.title}
            content={modal.content}
            buttons={modal.buttons} />
          <Loader show={app.showLoader} />
          <ModalPresentator />
          <Notifications notifications={notifications} style={style} />
        </Grid>
      </div>
    );
  }
}
function mapToStateProps(state) {
  return Object.assign(state, {
    auth: Object.assign(state.auth || {}, {
      username: localStorage.getItem('username'),
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role')
    })
  })
}
export default connect(mapToStateProps)(App);
