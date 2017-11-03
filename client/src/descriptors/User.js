import React from 'react'
import Date from '../components/forms/fields/Date'
import Select from '../components/forms/fields/Select'
import Password from '../components/forms/fields/Password'
import Props from '../components/forms/fields/user/Props'
import Profile from '../components/forms/fields/user/Profile'
import {
  DropdownButton,
  MenuItem
}
from 'react-bootstrap'
import { changeStatus, reset } from '../actions/User'
import Notifications from 'react-notification-system-redux'
let breadcrumbs = [{
  label: 'app.name',
  link: '#'
}, {
  label: 'app.label.config',
  link: '#/config'
}, {
  label: 'app.label.config.security',
  link: '#/config'
}, {
  label: 'app.label.user',
  link: '#/user/grid'
}]
function didUpdate() {
  const { dispatch, state } = this.props
  const { user, intl } = state
  if (user && user.executeStatus !== 'pending') {
    if (user.updateRecords.length > 0) {
      const { list } = this.props
      user.updateRecords.forEach(record => {
        var row = list.rows.find(r => r.id === record.id)
        row[record.field] = record.value
      })
    }
    dispatch(Notifications[user.executeStatus]({
      title: intl.messages['app.notification.' + user.executeStatus],
      message: user.executeMessage,
      position: 'br',
      autoDismiss: 5,
      dismissible: false
    }))
    dispatch(reset())
  }
}

export default {
  grid: {
    title: 'app.label.users',
    breadcrumbs: breadcrumbs,
    didUpdate: didUpdate,
    pagination: {
      limit: 10,
      sort: {
        column: 'Username'
      }
    },
    filters: {
      title: 'Search',
      items: {
        username: {
          label: 'app.label.username',
          clause: 'like'
        },
        role: {
          label: 'app.label.role',
          clause: 'equals'
        }
      }
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
      status: {
        header: 'app.label.status',
        sort: 'status',
        render: function(props) {
          const { value, row } = props
          const { dispatch, token } = this.props
          const { id } = row
          let styles = {
            'Active': 'success',
            'Pending': 'warning'
          }
          var statuses = ['Active', 'Pending']
          return (
            <DropdownButton
              bsSize='xsmall'
              bsStyle={styles[value]}
              title={value || ''}
              id="status-changer">
              {statuses.map(status =>
                <MenuItem
                  key={status}
                  onClick={() => {
                    if (value !== status) {
                      dispatch(changeStatus({ token, status, id }))
                    }
                  }}>
                  {status}
                </MenuItem>
              )}
            </DropdownButton>
          )
        }
      },
      role: {
        header: 'app.label.role',
        sort: 'role'
      },
      expiry_date: {
        header: 'app.label.expiry_date',
        sort: 'expiry_date'
      },
      modified: {
        header: 'app.label.modified',
        sort: 'modified'
      }
    }
  },
  form: {
    title: {
      create: 'app.form.user.create',
      modify: 'app.form.user.modify'
    },
    breadcrumbs: breadcrumbs.concat({
      label: 'app.grid.breadcrumb.form',
      props: {
        active: true
      }
    }),
    events: {
      create(data) {
        return Object.assign(data, {
          role: data.role || 'user',
          status: data.status || 'Active'
        })
      }
    },
    fields: {
      username: {
        label: 'app.label.username'
      },
      password: {
        label: 'app.label.password',
        render: function(props) {
          const { item, value, field, validationError } = props
          const { name } = field
          return (
            <Password
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange.bind(this)}/>
          )

        }
      },
      email: {
        label: 'app.label.email'
      },
      expiry_date: {
        roles: ['admin'],
        label: 'app.label.expiry_date',
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
      role: {
        label: 'app.label.role',
        roles: ['admin'],
        render: (props) => {
          const { field, item, validationError } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              item={item}
              field={field}
              value={value}
              options={[
                { label: 'Admin', value: 'admin' },
                { label: 'User', value: 'user' }]}
              validationError={validationError}
              onChange={props.onChange}/>
          )
        }
      },
      status: {
        label: 'app.label.status',
        roles: ['admin'],
        render: (props) => {
          const { field, item, validationError } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Select
              key={name}
              item={item}
              field={field}
              value={value}
              options={[
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' }]}
              validationError={validationError}
              onChange={props.onChange}/>
          )
        }
      },
      props: {
        label: 'app.label.props',
        roles: ['admin'],
        render: (props) => {
          const { field, item, validationError } = props
          const { name } = field
          var value = props.value || ''
          return (
            <Props
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange}/>
          )

        }
      },
      profile: {
        label: 'app.label.profile_prop',
        roles: ['admin'],
        render: (props) => {
          const { field, item, validationError } = props
          const { name } = field
          var value = props.value || {}
          return (
            <Profile
              key={name}
              item={item}
              field={field}
              value={value}
              validationError={validationError}
              onChange={props.onChange}/>
          )
        }
      }
    }
  }
}
