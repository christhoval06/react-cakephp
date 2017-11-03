import React from 'react'
import SubscriptionPaymentGrid from '../components/grids/SubscriptionPayment'
import { FormattedNumber } from 'react-intl'
import { Label } from 'react-bootstrap'
import { updateRowFields } from '../actions/Rest'
import {
  FormGroup,
  FormControl
} from 'react-bootstrap'

export default {
  name: 'app.label.subscription_payment',
  grid: {
    render: function(props) {
      const { grid, descriptor, resource, token, list } = props
      const { location } = this.props
      return (
        <SubscriptionPaymentGrid
          grid={grid}
          location={location}
          descriptor={descriptor}
          resource={resource}
          token={token}
          list={list} />
      )
    },
    pagination: {
      limit: 10,
      sort: {
        column: 'created',
        descending: true
      }
    },
    title: 'app.label.subscription_payment',
    filters: {
      items: {
      }
    },
    columns: {
      id: {
        roles: ['admin'],
        header: 'app.label.id',
        sort: 'id'
      },
      created: {
        header: 'app.label.created',
        sort: 'created'
      },
      user: {
        roles: ['admin'],
        header: 'app.label.username',
        render: function(props) {
          return (
            <small>{props.value || ''}</small>
          )
        }
      },
      payout: {
        header: 'app.label.payout',
        render: function(props) {
          var value = props.value || 0
          return (
            <FormattedNumber
              value={value}
              {...{style:'currency'}}
              currency='EUR'
              currencyDisplay='symbol' />
          )
        }
      },
      billing_year: {
        roles: ['admin'],
        header: 'app.label.year',
        sort: 'billing_year',
        render: function(props) {
          const { dispatch } = this.props
          const { value } = props
          const { row } = props
          return (
            <FormGroup
              bsSize="small"
              style={{ width: '80px' }}>
              <FormControl
                value={value || ''}
                className={'text-center'}
                onChange={(evt) => {
                  dispatch(updateRowFields(row, {
                    billing_year: evt.target.value,
                    changed: true
                  }))
                }}
                type="number" />
            </FormGroup>
          )
        }
      },
      billing_number: {
        roles: ['admin'],
        header: 'app.label.number',
        sort: 'billing_number',
        render: function(props) {
          const { dispatch } = this.props
          const { value } = props
          const { row } = props
          return (
            <FormGroup
              bsSize="small"
              style={{ width: '80px' }}>
              <FormControl
                value={value || ''}
                className={'text-center'}
                onChange={(evt) => {
                  dispatch(updateRowFields(row, {
                    billing_number: evt.target.value,
                    changed: true
                  }))
                }}
                type="number" />
            </FormGroup>
          )
        }
      },
      status: {
        header: 'app.label.status',
        sort: 'status',
        render: function(props) {
          var style = (props.value === 'Completed')
            ? 'success'
            : 'warning'

          return (
            <Label bsStyle={style}>{props.value || ''}</Label>
          )
        }
      },
      message: {
        header: 'app.label.message',
        render: function(props) {
          const { value } = props
          return (
            <p
              title={value}
              style={{
              width: '170px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>{value}</p>
          )
        }
      }
    }
  }
}
