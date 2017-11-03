import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  PageHeader,
  Breadcrumb,
  Pagination,
  ButtonGroup,
  Glyphicon,
  Button,
  Alert,
  Row
} from 'react-bootstrap'
import { list, remove } from '../../actions/Rest'
import { showFilters, hideFilters } from '../../actions/Grid'
import { endpoint } from '../../config'
import { isFunction } from '../../system/Type'
import { FormattedMessage } from 'react-intl'
import { open as openLink } from '../../actions/Router'
import { reset } from '../../actions/Subscription'
import { showLoader } from '../../actions/App'
import s from 'underscore.string'
import Search from './Search'
import SubscriptionPackageRow from './rows/SubscriptionPackage'
import Notifications from 'react-notification-system-redux'

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
    const { dispatch, state } = this.props
    const { subscription, intl } = state
    if (subscription.shouldRedirectToPaypal) {
      dispatch(showLoader())
      dispatch(reset())
      dispatch(openLink(subscription.paypalRedirectAction))

    }
    if (subscription.shouldDisplayMessage) {
      dispatch(Notifications[subscription.displayMessageType]({
        title: intl.messages['app.notification.' + subscription.displayMessageType],
        message: subscription.displayMessage,
        position: 'br',
        autoDismiss: 5,
        dismissible: false
      }))
      dispatch(reset())
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
    const { request } = list
    const { grid } = descriptor
    const { auth } = state

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
            {auth.role === 'admin' && 
              <Button bsStyle='info' onClick={this.refresh.bind(this)}>
                <Glyphicon glyph="refresh" />
                &nbsp;
                <FormattedMessage
                  id='app.grid.button.refresh'
                  defaultMessage='Refresh' />
              </Button>
            }
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
        <Row>
        {list.rows.filter(r => r.group === 'top').map((row, index) =>
          <SubscriptionPackageRow
            key={index}
            row={row}
            auth={auth}
            resource={resource}
            onRemove={(id) => this.remove(id)} />
        )}
        </Row>
        <Row>
        {list.rows.filter(r => r.group === 'bottom').map((row, index) =>
          <SubscriptionPackageRow
            key={index}
            row={row}
            auth={auth}
            resource={resource}
            onRemove={(id) => this.remove(id)} />
        )}
        </Row>
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
