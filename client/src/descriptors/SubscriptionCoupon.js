import React from 'react'
import Autocomplete from '../components/forms/fields/Autocomplete'
import Date from '../components/forms/fields/Date'
import Textarea from '../components/forms/fields/Textarea'
import { load } from '../actions/Rest'
import { endpoint } from '../config'
let breadcrumbs = [{
  label: 'app.name',
  link: '#'
}, {
  label: 'app.label.config',
  link: '#/config'
}, {
  label: 'app.label.config.payments',
  link: '#/config'
}, {
  label: 'app.label.config.coupons',
  link: '#/subscription-coupon/grid'
}]
export default {
  name: 'app.label.coupon',
  grid: {
    breadcrumbs: breadcrumbs,
    pagination: {
      sort: {
        column: 'created',
        descending: true
      }
    },
    filters: {
      items: {}
    },
    columns: {
      coupon_code: {
        header: 'app.label.code'
      },
      discount: {
        header: 'app.label.discount'
      },
      expiry_date: {
        header: 'app.label.expiry_date'
      },
      max_payments: {
        header: 'app.label.max_payments'
      },
      max_users: {
        header: 'app.label.max_users'
      },
      used_coupons: {
        header: 'app.label.used_coupons'
      }
    }
  },
  form: {
    title: {
      create: 'app.form.subscription_package.create',
      modify: 'app.form.subscription_package.modify'
    },
    breadcrumbs: breadcrumbs.concat({
      label: 'app.grid.breadcrumb.form',
      props: {
        active: true
      }
    }),
    fields: {
      subscription_package_id: {
        label: 'app.label.subscription_package',
        help: 'app.label.subscription_coupon.help.package',
        render: function(props) {
          const { value, field } = props
          const { state } = this.props
          const { rest } = state
          let loading = rest.load && rest.load.subscription_packages && rest.load.subscription_packages.loading
          let groups = rest.load && rest.load.subscription_packages
            ? rest.load.subscription_packages.rows.map(r => {
              return {
                label: r.title,
                value: r.id
              }
            })
            : []
          var targetGroup = groups.find(g => g.value === value)
          if (!targetGroup || targetGroup === null) {
            const { item } = props
            groups.push({
              label: item.group,
              value: value
            })
          }
          return (
            <Autocomplete
              key='subscription_package_id'
              field={field}
              value={value}
              options={groups}
              isLoading={loading}
              onInputChange={(value) => {
                this._lastKeyword = value
                const { dispatch } = this.props
                setTimeout(() => {
                  if( this._lastKeyword !== value) {
                    return
                  }
                  var resource = endpoint('subscription-package')
                  var request = {
                    limit: 100,
                    page: 1,
                    filters: [{
                      name: "title",
                      clause: "like",
                      value: value
                    }]
                  }
                  dispatch(load(resource, request, 'subscription_packages'))
                }, 500)
              }}
              onChange={(name, value) => props.onChange(name, value)}
              className="form-control" />
          )
        }
      },
      coupon_code: {
        label: 'app.label.code',
        help: 'app.label.subscription_coupon.help.code'
      },
      discount: {
        label: 'app.label.discount',
        help: 'app.label.subscription_coupon.help.discount'
      },
      expiry_date: {
        label: 'app.label.expiry_date',
        help: 'app.label.subscription_coupon.help.expiry_date',
        render: function(props) {
          const { field, value, item, validationError } = props
          const { name } = field
          return (
            <Date
              key={name}
              item={item}
              field={field}
              value={value}
              format="DD/MM/YYYY"
              validationError={validationError}
              onChange={props.onChange} />
          )
        }
      },
      max_payments: {
        label: 'app.label.max_payments',
        help: 'app.label.subscription_coupon.help.max_payments'
      },
      max_users: {
        label: 'app.label.max_users',
        help: 'app.label.subscription_coupon.help.max_users'
      },
      notes: {
        label: 'app.label.notes',
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
      }
    }
  }
}
