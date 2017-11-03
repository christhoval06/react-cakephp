import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  PageHeader,
  Breadcrumb,
  Pagination,
  ButtonGroup,
  Glyphicon,
  Button,
  Table,
  Alert
} from 'react-bootstrap'
import { list, remove } from '../../actions/Rest'
import { printInvoice, requestInvoice, setInvoice } from '../../actions/Subscription'
import { showFilters, hideFilters } from '../../actions/Grid'
import { updateRowFields } from '../../actions/Rest'
import { endpoint } from '../../config'
import { isFunction } from '../../system/Type'
import { FormattedMessage } from 'react-intl'
import s from 'underscore.string'
import Search from './Search'

class Grid extends Component {
  static propTypes = {
    descriptor: React.PropTypes.object.isRequired,
    resource: React.PropTypes.string.isRequired,
    token: React.PropTypes.string,
    grid: React.PropTypes.object.isRequired,
    list: React.PropTypes.shape({
      rows: React.PropTypes.array.isRequired,
      count: React.PropTypes.number.isRequired
    })
  }
  componentDidMount() {
    const { descriptor } = this.props
    if (descriptor.grid && descriptor.grid.didMount) {
      descriptor.grid.didMount.apply(this)
    }
    this.refresh(null, {
      page: 1,
      sort: descriptor.grid.pagination.sort,
      filters: []
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { descriptor } = this.props
    if (descriptor.grid && descriptor.grid.didUpdate) {
      descriptor.grid.didUpdate.apply(this)
    }
    if(prevProps.resource !== this.props.resource) {
      this.refresh(null, {
        page: 1,
        sort: { },
        filters: []
      })
    }
  }

  refresh(evt, overrideRequest = {}) {
    const { dispatch, resource, descriptor, token } = this.props
    if (token) {
      var req = Object.assign({
        sort: this.props.list.request.sort
          ? this.props.list.request.sort
          : descriptor.grid.pagination.sort,
        token: token,
        limit: descriptor.grid.pagination
          ? descriptor.grid.pagination.limit
          : 10
      }, overrideRequest)
      var request = Object.assign({}, this.props.list && this.props.list.request
        ? this.props.list.request
        : {}, req)
      dispatch(list(endpoint(resource), request))
    }
  }

  printInvoice(id) {
    const { dispatch, token } = this.props
    dispatch(printInvoice({ token, id }))
  }
  requestInvoice(row) {
    const { dispatch, token } = this.props
    dispatch(requestInvoice({ token, id: row.id }))
    dispatch(updateRowFields(row, {
      invoice_status: 'pending'
    }))
  }
  setInvoice(row) {
    const { dispatch, token } = this.props
    dispatch(setInvoice({ token, id: row.id, billing_year: row.billing_year, billing_number: row.billing_number }))
    dispatch(updateRowFields(row, {
      invoice_status: 'completed'
    }))
  }

  remove(id) {
    const { dispatch, resource, token } = this.props
    dispatch(remove(endpoint(resource), id, token))
  }

  sort(column, descending) {
    const { dispatch, resource } = this.props
    var request = Object.assign({}, this.props.list.request, {
      sort: {
        column: column,
        descending: descending
      }
    })
    dispatch(list(endpoint(resource), request))
  }

  showFilters() {
    const { dispatch } = this.props
    dispatch(showFilters())
  }
  hideFilters() {
    const { dispatch } = this.props
    dispatch(hideFilters())
  }

  filter(filters) {
    const { dispatch, resource } = this.props
    var request = Object.assign(this.props.list.request, {
      filters: filters
    })
    dispatch(hideFilters())
    dispatch(list(endpoint(resource), request))
  }

  changePage(page) {
    if (page === this.props.list.request.page) return
    const { dispatch, resource } = this.props
    var request = Object.assign(this.props.list.request, {
      page: page
    })
    dispatch(list(endpoint(resource), request))
  }

  render() {
    const { resource, descriptor, list, state } = this.props
    const { auth } = state
    const { request } = list
    const { grid } = descriptor

    var limit = request ? request.limit : 10
    var count = list ? list.count : 0
    var pages = parseInt((count / limit) + (count % limit !== 0 ? 1 : 0), 10)
    var page = request ? request.page : 1
    var showFilters = this.props.grid && this.props.grid.showFilters
      ? true
      : false
    var filtersData = request.filters ? request.filters : []
    var filters = descriptor.grid && descriptor.grid.filters
      ? descriptor.grid.filters
      : []

    var breadcrumbTitle = null
    if (descriptor.name) {
      if(isFunction(descriptor.name)) {
        breadcrumbTitle = descriptor.name.apply(this)
      }
      else {
        breadcrumbTitle = (
          <FormattedMessage
            id={descriptor.name}
            defaultMessage={descriptor.name} />
        )
      }
    }
    else {
      breadcrumbTitle = s(resource).capitalize().value()
    }

    var gridTitle = grid.title || resource
    if (isFunction(gridTitle)) {
      gridTitle = gridTitle.apply(this)
    }
    else {
      gridTitle = (
        <FormattedMessage
          id={gridTitle}
          defaultMessage={gridTitle} />
      )
    }
    return (
      <div>
        <PageHeader>
          {gridTitle}
          {' '}
          <small className="badge badge-info">{list.count}</small>
          <ButtonGroup className='pull-right'>
            <Button bsStyle='info' onClick={this.refresh.bind(this)}>
              <Glyphicon glyph="refresh" />
              &nbsp;
              <FormattedMessage
                id='app.grid.button.refresh'
                defaultMessage='Refresh' />
            </Button>
            {descriptor.grid.filters && Object.keys(descriptor.grid.filters.items).length > 0 &&
              <Button bsStyle='primary' onClick={this.showFilters.bind(this)}>
                <Glyphicon glyph="search" />
                &nbsp;
                <FormattedMessage
                  id='app.grid.button.search'
                  defaultMessage='Search' />
              </Button>
            }
          </ButtonGroup>
        </PageHeader>
        <Breadcrumb>
          <Breadcrumb.Item href="#">
            <FormattedMessage
              id='app.grid.breadcrumb.table'
              defaultMessage='app.grid.breadcrumb.table' />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{breadcrumbTitle}</Breadcrumb.Item>
        </Breadcrumb>
        <Table responsive striped hover>
          <thead>
            <tr>
              {Object.keys(grid.columns).map(name => {
                var column = grid.columns[name]
                var isInRole = !column.roles || column.roles.find(r => r === auth.role) != null
                if (!isInRole) {
                  return null
                }
                var header = column.header
                if (isFunction(header)) {
                  header = header.apply(this)
                }
                if (column.sort) {
                  var sort = request && request.sort && request.sort.column === column.sort
                    ? request.sort
                    : null
                  var descending = sort ? sort.descending : false
                  return (
                    <th key={name}>
                      <a
                        style={{ cursor: 'pointer' }}
                        onClick={this.sort.bind(this, column.sort, !descending)}>
                        <FormattedMessage
                          id={header}
                          defaultMessage={header} />
                        {sort && ' '}
                        {sort && !descending && <Glyphicon glyph="sort-by-alphabet" />}
                        {sort && descending && <Glyphicon glyph="sort-by-alphabet-alt" />}
                      </a>
                    </th>
                  )
                }
                else {
                  return (
                    <th key={name}>
                      <FormattedMessage
                        id={header}
                        defaultMessage={header} />
                    </th>
                  )
                }
              })}
              <th style={{ minWidth: '250px' }}>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.map(row => {
              var id = row.id
              var additionalProps = {}
              return (
                <tr key={id} {...additionalProps}>
                  {Object.keys(grid.columns).map(name => {
                    let column = Object.assign({}, grid.columns[name], {
                      name: name
                    })
                    var isInRole = !column.roles || column.roles.find(r => r === auth.role) != null
                    if (!isInRole) {
                      return null
                    }
                    var value = row[name]
                    if (column.render != null) {
                      value = column.render.apply(this, [{
                        column: column,
                        value: value,
                        row: row
                      }])
                    }
                    return (<td key={name}>{value}</td>)
                  })}
                  <td className="text-right">
                    {row.invoice_status === 'completed' &&
                      <Button
                        bsStyle='primary'
                        bsSize='xsmall'
                        onClick={() => this.printInvoice(id)}>
                        <FormattedMessage
                          id='app.label.print_invoice' />
                      </Button>
                    }
                    {(row.invoice_status === 'none' || row.invoice_status === 'pending') &&
                      <Button
                        disabled={row.invoice_status === 'pending'}
                        bsStyle='info'
                        bsSize='xsmall'
                        onClick={() => this.requestInvoice(row)}>
                        <FormattedMessage id='app.label.request_invoice' />
                      </Button>
                    }
                    {' '}
                    {auth.role === 'admin' && row.invoice_status === 'pending' &&
                      <Button
                        disabled={!row.changed}
                        bsStyle='warning'
                        bsSize='xsmall'
                        onClick={() => this.setInvoice(row)}>
                        <FormattedMessage id='app.label.set_invoice' />
                      </Button>
                    }

                    {' '}
                    {auth.role === 'admin' &&
                      <Button
                        disabled={row.deleted}
                        bsStyle='danger'
                        bsSize='xsmall'
                        onClick={() => this.remove(id)}>
                        <FormattedMessage
                          id='app.grid.button.delete'
                          defaultMessage='Delete' />
                      </Button>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {list.count === 0 && list.rows.length === 0 && <Alert bsStyle='info'>No records</Alert>}
        {pages > 1 &&
          <Pagination
            bsSize="large"
            activePage={page}
            items={pages}
            next={true}
            prev={true}
            first={true}
            last={true}
            maxButtons={10}
            onSelect={this.changePage.bind(this)} />}
        <Search
          visible={showFilters}
          filters={filters}
          data={filtersData}
          onSubmit={this.filter.bind(this)} />
      </div>
    )
  }
}
function mapToStateProps(state) {
  return {
    state
  }
}
export default connect(mapToStateProps)(Grid)
