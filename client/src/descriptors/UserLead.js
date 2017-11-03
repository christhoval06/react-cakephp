import React from 'react'
import UserLeadGrid from '../components/grids/UserLead'
import { FormattedNumber } from 'react-intl'
import { Label } from 'react-bootstrap'

export default {
  name: 'app.label.leads',
  grid: {
    title: 'app.label.leads',
    render: function(props) {
      const { grid, descriptor, resource, token, list } = props
      return (
        <UserLeadGrid
          grid={grid}
          descriptor={descriptor}
          resource={resource}
          token={token}
          list={list} />
      )
    },
    pagination: {
      limit: 10,
      sort: {
        column: 'Username'
      }
    },
    filters: {
      items: { }
    },
    columns: {
      id: {
        header: 'app.label.id',
        sort: 'id'
      },
      username: {
        header: 'app.label.username',
        sort: 'username'
      },
      email: {
        header: 'app.label.email',
        sort: 'email'
      },
      lead_status: {
        header: 'app.label.status',
        sort: 'lead_status',
        render: function(props) {
          const { value } = props
          var status = 'default'
          switch(value) {
            case 'Acquired':
              status = 'success';
              break;
            case 'Pending':
              status = 'warning';
              break;
            default:
              status = 'primary';
              break;
          }
          return (
            <Label bsStyle={status}>{value}</Label>
          )
        }
      },
      first_payment_commission: {
        header: 'app.label.first_payment_commission',
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
      next_payments_commission: {
        header: 'app.label.next_payments_commission',
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
      next_payments_count: {
        header: 'app.label.next_payments_count',
        render: (props) => {
          return parseFloat(props.value) > 0 ? props.value : 0
        }
      },
      total_commission: {
        header: 'app.label.total',
        render: (props) => {
          const { row } = props
          var total = 0
          if (row.first_payment_commission != null) {
            total += parseFloat(row.first_payment_commission)
          }
          if (row.next_payments_commission != null) {
            total += parseFloat(row.next_payments_commission)
          }
          return (
            <FormattedNumber
              value={total}
              {...{style:'currency'}}
              currency='EUR'
              currencyDisplay='symbol' />
          )
        }
      }
    }
  }
}
