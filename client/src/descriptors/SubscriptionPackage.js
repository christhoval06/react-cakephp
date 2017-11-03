import React from 'react'
import SubscriptionPackageGrid from '../components/grids/SubscriptionPackage'
import Textarea from '../components/forms/fields/Textarea'
import Checkbox from '../components/forms/fields/Checkbox'
import Select from '../components/forms/fields/Select'
import HtmlEditor from '../components/forms/fields/HtmlEditor'
import { createPayment, reset } from '../actions/Subscription'
import { push } from '../actions/Router'

export default {
  name: 'app.label.subscription_package',
  form: {
    title: {
      create: 'app.form.subscription_package.create',
      modify: 'app.form.subscription_package.modify'
    },
    fields: {
      theme: {
        label: 'app.label.theme',
        render: (props) => {
          const { field } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              field={field}
              value={value}
              options={[
                { label: 'Success', value: 'success' },
                { label: 'Warning', value: 'warning' },
                { label: 'Primary', value: 'primary' },
                { label: 'Default', value: 'default' },
                { label: 'Danger', value: 'danger' },
                { label: 'Info', value: 'info' }]}
              onChange={props.onChange}/>
          )
        }
      },
      group: {
        label: 'app.label.group'
      },
      ordinal: {
        label: 'app.label.ordinal'
      },
      title: {
        label: 'app.label.title'
      },
      is_active: {
        label: 'app.label.is_active',
        render: function(props) {
          const { field, value, item, validationError } = props
          const { name } = field
          return (
            <Checkbox
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange} />
          )
        }
      },
      description: {
        label: 'app.label.description',
        render: function(props) {
          const { field, value, item, validationError } = props
          const { name } = field
          return (
            <HtmlEditor
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange} />
          )
        }
      },
      description_for_paypal: {
        label: 'app.label.description_for_paypal',
        render: function(props) {
          const { field, value, item, validationError } = props
          const { name } = field
          return (
            <Textarea
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange} />
          )
        }
      },
      billing_type: {
        label: 'app.label.billing_type',
        render: (props) => {
          const { field } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              field={field}
              value={value}
              options={[{
                label: 'RecurringPayments',
                value: 'RecurringPayments'
              }, {
                label: 'MerchantInitiatedBilling',
                value: 'MerchantInitiatedBilling'
              }]}
              onChange={props.onChange}/>
          )
        }
      },
      billing_period: {
        label: 'app.label.billing_period',
        render: (props) => {
          const { field } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              field={field}
              value={value}
              options={[{
                label: 'Day',
                value: 'Day'
              }, {
                label: 'Week',
                value: 'Week'
              }, {
                label: 'SemiMonth',
                value: 'SemiMonth'
              }, {
                label: 'Month',
                value: 'Month'
              }, {
                label: 'Year',
                value: 'Year'
              }]}
              onChange={props.onChange}/>
          )
        }
      },
      billing_frequency: {
        label: 'app.label.billing_frequency'
      },
      quota_type: {
        label: 'app.label.quota_type',
        render: (props) => {
          const { field } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              field={field}
              value={value}
              options={[{
                label: 'Daily',
                value: 'Daily'
              }]}
              onChange={props.onChange}/>
          )
        }
      },
      quota_size: {
        label: 'app.label.quota_size'
      },
      amount: {
        label: 'app.label.amount'
      },
      vat: {
        label: 'app.label.vat'
      },
      economy: {
        label: 'app.label.economy'
      }
    }
  },
  grid: {
    didUpdate: function() {
      const { dispatch, location, token, state } = this.props
      const { query } = location
      const { subscription } = state
      const { paymentStatus } = subscription
      if (query.s === 'p' && query.token && paymentStatus === 'pending') {
        dispatch(createPayment({
          token: token,
          paypal_token: query.token,
          coupon: query.coupon
        }))
      }
      else if(paymentStatus === 'success') {
        dispatch(reset())
        dispatch(push('/subscription-payment/grid'))
      }
    },
    render: function(props) {
      const { grid, descriptor, resource, token, list } = props
      const { location } = this.props
      return (
        <SubscriptionPackageGrid
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
        column: 'ordinal'
      }
    },
    title: 'app.label.subscription_package',
    filters: {
      items: {
      }
    }
  }
}
