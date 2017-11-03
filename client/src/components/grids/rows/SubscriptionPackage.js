import React, { Component } from 'react'
import {
  Badge,
  Button,
  ButtonGroup,
  Panel,
  Col,
  ListGroup,
  ListGroupItem,
  Glyphicon,
  FormGroup,
  FormControl,
  ControlLabel,
  InputGroup,
  Alert
}
from 'react-bootstrap'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { getProfile } from '../../../actions/User'
import { buyPackage, checkCoupon } from '../../../actions/Subscription'
import { format, isNullOrEmpty } from '../../../system/String'


class SubscriptionPackage extends Component {
  static propTypes = {
    auth: React.PropTypes.object.isRequired,
    row: React.PropTypes.object.isRequired,
    resource: React.PropTypes.string.isRequired,
    onRemove: React.PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      couponCode: ''
    }
  }

  buy(id) {
    const { dispatch, auth, state } = this.props
    const { subscription } = state
    const { discount } = subscription
    const { token, valid } = auth
    var coupon = null
    if (discount.package === id && discount.price > 0) {
      coupon = discount.coupon
    }
    if (valid) {
      dispatch(buyPackage({ token, id, coupon }))
    }
    else {
      dispatch(getProfile({ token, args: { packageId: id, coupon: coupon } }))
    }
  }

  applyCoupon(evt) {
    const { dispatch, auth, row } = this.props
    const { token } = auth
    dispatch(checkCoupon({
      token: token,
      coupon: this.state.couponCode,
      package: row.id
    }))
  }

  render() {
    const { row, auth, resource, state } = this.props
    const { subscription } = state
    const { discount } = subscription
    const { intl } = state
    const { locale } = intl
    var className = "animated fadeIn"
    var style = Object.assign({})
    if (row.theme === 'top') {
      className = "animated pulse"
      style = Object.assign({
        animationDuration: '5s'
      })
    }
    var description = row.description
    if (description.indexOf('<p lang=') !== -1) {
      var descriptions = description.split('</p>');
      var localizedDesc = descriptions.find(d => d.indexOf(format('<p lang="{0}"',locale)) !== -1)
      if (!isNullOrEmpty(localizedDesc)) {
        description = format("{0}</p>", localizedDesc)
      }
    }
    return (
      <Col lg={4} md={4} sm={6} xs={12}>
        <Panel
          className={className}
          style={style}
          bsStyle={row.theme !== 'top' ? row.theme : 'primary'}
          header={row.title}
          footer={
            <div>
              <Button bsStyle='success' onClick={() => this.buy(row.id)}>
                <FormattedMessage id="app.label.buy" />
              </Button>
              {auth.role === 'admin' &&
                <ButtonGroup className="pull-right">
                  <Link
                    to={{ pathname: resource + '/edit/' + row.id }}
                    className="btn btn-info">
                    <FormattedMessage
                      id='app.grid.button.edit'
                      defaultMessage='Edit' />
                  </Link>
                  <Button bsStyle='danger' onClick={() => this.props.onRemove(row.id)}>
                    <FormattedMessage id="app.grid.button.delete" />
                  </Button>
                </ButtonGroup>
              }
            </div>
          }>
          <div dangerouslySetInnerHTML={{ __html: description}} />
          <ListGroup>
            <ListGroupItem active>
              <FormattedMessage id="app.label.renewal" />
              <Badge className="pull-right">
                <Glyphicon glyph="plus" />
                {' '}
                {row.billing_frequency}
                {' '}
                <FormattedMessage id={
                    'app.label.billing_period.' +
                      ( row.billing_period ? (
                        row.billing_period.toLowerCase() +
                        (row.billing_frequency > 1 ? 's' : '')
                      ) : 'month')
                } />
              </Badge>
            </ListGroupItem>
            <ListGroupItem active>
              <FormattedMessage id="app.label.autobill" />
              <Badge className="pull-right">
                <Glyphicon glyph="calendar" />
                {' '}
                {row.billing_type === 'RecurringPayments' &&
                  <FormattedMessage id="app.label.every" />
                }
                {' '}
                {row.billing_type === 'RecurringPayments' && row.billing_frequency > 0 && row.billing_frequency + ' '}
                {row.billing_type === 'RecurringPayments' &&
                  <FormattedMessage id={
                      'app.label.billing_period.' +
                        ( row.billing_period ? (
                          row.billing_period.toLowerCase() +
                          (row.billing_frequency > 1 ? 's' : '')
                        ) : 'month')
                  } />
                }
                {row.billing_type !== 'RecurringPayments' &&
                  <FormattedMessage id="app.label.no" />
                }
              </Badge>
            </ListGroupItem>
            <ListGroupItem active>
              <FormattedMessage id="app.label.traffic_limit" />
              <Badge className="pull-right">
                <Glyphicon glyph="ok" />
                {' '}
                {row.quota_size > 0 &&
                  <span>
                    {row.quota_size}
                    {' '}
                    <FormattedMessage id="app.label.daily_views" />
                  </span>
                }

                {(row.quota_size === 0 || row.quota_size === null) &&
                  <FormattedMessage id="app.label.none" />
                }
              </Badge>
            </ListGroupItem>
            <ListGroupItem active>
              <FormattedMessage id="app.label.price" />
              {discount.package === row.id && discount.price > 0 &&
                <Badge className="pull-right animated fadeIn">
                  {row.economy > 0 &&
                    <span style={{ textDecoration: 'line-through' }} className="text-danger">
                      <FormattedNumber
                        value={parseFloat(row.economy > 0 ? row.economy : 0) + parseFloat(row.amount || 0)}
                        {...{style: 'currency'}}
                        currency='EUR'
                        currencyDisplay='symbol' />
                    </span>
                  }
                  {' '}
                  <span style={{ textDecoration: 'line-through' }} className="text-danger">
                    <FormattedNumber
                      value={row.amount || 0}
                      {...{style: 'currency'}}
                      currency='EUR'
                      currencyDisplay='symbol' />
                  </span>
                  {' '}
                  <FormattedNumber
                    value={parseFloat(row.amount || 0) - parseFloat(discount.price)}
                    {...{style: 'currency'}}
                    currency='EUR'
                    currencyDisplay='symbol' />
                </Badge>
              }
              {(discount.package !== row.id || !discount.price) &&
                <Badge className="pull-right">
                  {row.economy > 0 &&
                    <span style={{ textDecoration: 'line-through' }} className="text-danger">
                      <FormattedNumber
                        value={parseFloat(row.economy > 0 ? row.economy : 0) + parseFloat(row.amount || 0)}
                        {...{style: 'currency'}}
                        currency='EUR'
                        currencyDisplay='symbol' />
                    </span>
                  }
                  <FormattedNumber
                    value={row.amount || 0}
                    {...{style: 'currency'}}
                    currency='EUR'
                    currencyDisplay='symbol' />
                </Badge>
              }
            </ListGroupItem>
          </ListGroup>
          <FormGroup>
            <ControlLabel>
              <FormattedMessage id="app.label.coupon_code_question" />
            </ControlLabel>
            <InputGroup>
              {discount.package === row.id && discount.price > 0 &&
                <InputGroup.Addon>
                  <Glyphicon glyph="check" />
                </InputGroup.Addon>
              }
              <FormControl
                type="text"
                value={this.state.couponCode}
                onChange={(e) => this.setState({ couponCode: e.target.value })}/>
              <InputGroup.Button>
                <Button onClick={() => this.applyCoupon() }>
                  <FormattedMessage id="app.label.apply" />
                </Button>
              </InputGroup.Button>
            </InputGroup>
            {discount.package === row.id && discount.message && <br />}
            {discount.package === row.id && discount.message &&
              <Alert className="animated fadeIn" bsStyle={discount.error ? 'warning' : 'success'}>
                {discount.message}
              </Alert>
            }
          </FormGroup>
        </Panel>
      </Col>
    )
  }
}

function mapToStateProps(state) {
  return {
    state
  }
}
export default connect(mapToStateProps)(SubscriptionPackage)
