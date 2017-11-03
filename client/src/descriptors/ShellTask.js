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
  label: 'app.label.shell_tasks',
  link: '#/shell-task/grid'
}]
export default {
  name: 'app.label.shell_task',
  grid: {
    title: 'app.label.shell_tasks',
    breadcrumbs: breadcrumbs,
    pagination: {
      limit: 10,
      sort: {
        column: 'end_at',
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
      name: {
        header: 'app.label.name',
        sort: 'name'
      },
      start_at: {
        header: 'app.label.start_at',
        sort: 'start_at'
      },
      end_at: {
        header: 'app.label.end_at',
        sort: 'end_at'
      }
    }
  }
}
