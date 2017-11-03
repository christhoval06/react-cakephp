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
  Alert,
  Row,
  Col
} from 'react-bootstrap'
import { Link } from 'react-router'
import { list } from '../../actions/Rest'
import { showFilters, hideFilters } from '../../actions/Grid'
import { endpoint, link } from '../../config'
import { isFunction } from '../../system/Type'
import { FormattedMessage, FormattedNumber } from 'react-intl'
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
        sort: descriptor.grid.pagination.sort,
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
    const { state } = this.props
    const { auth } = state
    const { resource, descriptor, list } = this.props
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
    var fpc = list && list.rows && list.rows.length > 0 ? list.rows.filter(r => r.first_payment_commission != null) : []
        fpc = fpc.length > 0 ? fpc.map(r => parseFloat(r.first_payment_commission)).reduce((a, b) => a + b) : 0

    var npc = list && list.rows && list.rows.length > 0 ? list.rows.filter(r => r.next_payments_commission != null) : []
        npc = npc.length > 0 ? npc.map(r => parseFloat(r.next_payments_commission)).reduce((a, b) => a + b) : 0

    var commissions = fpc + npc
    var ufpc = 0, unpc = 0
    if (auth.first_payment_commission != null) {
      ufpc = parseFloat(auth.first_payment_commission)
    }
    if (auth.next_payments_commission != null) {
      unpc = parseFloat(auth.next_payments_commission)
    }
    return (
      <div>
        <PageHeader>
          {gridTitle}
          {' '}
          <small className="badge badge-success">
            {list.count}{' - '}
            <FormattedNumber
              value={commissions}
              {...{style:'currency'}}
              currency='EUR'
              currencyDisplay='symbol' />
          </small>
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
          {descriptor.grid.breadcrumbs && descriptor.grid.breadcrumbs.length > 0 &&
            descriptor.grid.breadcrumbs.map((breadcrumb, index) =>
              <Breadcrumb.Item key={index} href={breadcrumb.link} {...breadcrumb.props}>
                <FormattedMessage id={breadcrumb.label} />
              </Breadcrumb.Item>
            )
          }
          {!descriptor.grid.breadcrumbs &&
            <Breadcrumb.Item href="#">
              <FormattedMessage
                id='app.grid.breadcrumb.table'
                defaultMessage='app.grid.breadcrumb.table' />
            </Breadcrumb.Item>
          }
          {!descriptor.grid.breadcrumbs &&
            <Breadcrumb.Item active>{breadcrumbTitle}</Breadcrumb.Item>
          }
          {ufpc > 0 &&
            <Breadcrumb.Item active>
              <FormattedMessage id="app.label.first_payment_commission" />
              {' '}
              <FormattedNumber
                value={ufpc}
                {...{style:'currency'}}
                currency='EUR'
                currencyDisplay='symbol' />
            </Breadcrumb.Item>
          }
          {unpc > 0 &&
            <Breadcrumb.Item active>
              <FormattedMessage id="app.label.next_payments_commission" />
              {' '}
              <FormattedNumber
                value={unpc}
                {...{style:'currency'}}
                currency='EUR'
                currencyDisplay='symbol' />
            </Breadcrumb.Item>
          }
          {commissions > 0 &&
            <Breadcrumb.Item active>
              <strong>
                <FormattedMessage id="app.label.earning" />
              </strong>
              {' '}
              <FormattedNumber
                value={commissions}
                {...{style:'currency'}}
                currency='EUR'
                currencyDisplay='symbol' />
            </Breadcrumb.Item>
          }
        </Breadcrumb>
        {auth.reseller_code &&
          <Row>
            <Col xs={12}>
              <Alert bsStyle='info'>
                <FormattedMessage id="app.label.reseller_code" />
                <br />
              </Alert>
              <pre>
                <a href={link('?r=' + auth.reseller_code)}>
                  {link('?r=' + auth.reseller_code)}
                </a>
              </pre>
            </Col>
          </Row>
        }
        <Table responsive striped hover>
          <thead>
            <tr>
              {Object.keys(grid.columns).map(name => {
                var column = grid.columns[name]
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
              <th style={{ minWidth: '150px' }}>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {list.rows.map(row => {
              var id = row.id
              var additionalProps = {}
              if (row.deleted) {
                additionalProps.className = 'danger'
              }
              return (
                <tr key={id} {...additionalProps}>
                  {Object.keys(grid.columns).map(name => {
                    let column = Object.assign({}, grid.columns[name], {
                      name: name
                    })
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
                    {!row.deleted && descriptor.form &&
                      <Link
                        to={{ pathname: resource + '/edit/' + id }}
                        className="btn btn-info btn-xs">
                        <FormattedMessage
                          id='app.grid.button.edit'
                          defaultMessage='Edit' />
                      </Link>
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
