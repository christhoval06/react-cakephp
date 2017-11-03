import React from 'react'
import Textarea from '../components/forms/fields/Textarea'

let breadcrumbs = [{
  label: 'app.name',
  link: '#'
}, {
  label: 'app.label.config',
  link: '#/config'
}, {
  label: 'app.label.config.system',
  link: '#/config'
}, {
  label: 'app.label.app_settings',
  link: '#/app-setting/grid'
}]
export default {
  name: 'app.label.app_settings',
  form: {
    breadcrumbs: breadcrumbs.concat({
      label: 'app.grid.breadcrumb.form',
      props: {
        active: true
      }
    }),
    title: {
      create: 'app.form.app_setting.create',
      modify: 'app.form.app_setting.modify'
    },
    fields: {
      key: {
        label: 'app.label.key'
      },
      value: {
        label: 'app.label.value'
      },
      description: {
        label: 'app.label.description',
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
  },
  grid: {
    title: 'app.label.app_settings',
    breadcrumbs: breadcrumbs,
    pagination: {
      limit: 10,
      sort: {
        column: 'id',
        descending: true
      }
    },
    filters: {
      items: {}
    },
    columns: {
      id: {
        header: 'app.label.id',
        sort: 'id'
      },
      key: {
        header: 'app.label.key',
        sort: 'key'
      },
      value: {
        header: 'app.label.value',
        sort: 'value'
      }
    }
  }
}
