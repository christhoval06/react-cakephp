import React, { Component } from 'react'
import { Alert, Row, Col } from 'react-bootstrap'
import { FormattedMessage} from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router'

class Subscription extends Component {
  static propTypes = {
    subscription: React.PropTypes.object.isRequired
  }
  shouldComponentUpdate(nextProps, nextState) {
    const { subscription } = nextProps
    if (subscription.shouldDisplayAlert !== this.props.subscription.shouldDisplayAlert) {
      return true
    }
    if (subscription.status !== this.props.subscription.status) {
      return true
    }
    return false
  }
  render() {
    const { subscription } = this.props
    if (subscription.shouldDisplayAlert) {
      return (
        <div>
          <br />
          <Alert
            bsStyle={subscription.alertStyle}
            className="animated fadeInDown">
            <FormattedMessage
              id={'app.label.subscription.status.' + subscription.status}
              values={Object.assign(subscription, {
                abs_days: Math.abs(subscription.days)
              })} />
            {subscription.status !== 'activated' &&
              <Row>
                <Col xs={12} className="text-right">
                  <br />
                  <Link
                    to={{ pathname: '/subscription-package/grid' }}
                    className="btn btn-xs btn-primary">
                    <FormattedMessage id="app.label.buy" />
                  </Link>
                </Col>
              </Row>
            }
          </Alert>
        </div>
      )
    }
    else return null
  }
}

export default connect(state => { return { state }})(Subscription)
