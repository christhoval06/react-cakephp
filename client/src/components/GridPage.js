import React, { Component } from 'react'
import { Alert, Row, Col } from 'react-bootstrap'
import Grid from './grids/Grid'
import { connect } from 'react-redux'
import descriptors from '../descriptors'

class GridPage extends Component {

  render() {
    const { params, state } = this.props
    const { resource } = params
    const { rest, auth, grid } = state
    const { token } = auth
    const { list } = rest

    if (list.error) {
      return (
        <Row>
          <Col lg={12}>
            <br />
            <Alert bsStyle='danger'>{list.message}</Alert>
          </Col>
        </Row>

      )
    }
    let descriptor = descriptors[resource]
    if (!descriptor) {
      return (
        <Row>
          <Col lg={12}>
            <br />
            <Alert bsStyle='danger'>
              No descriptor found for resource: {resource}
            </Alert>
          </Col>
        </Row>
      )
    }
    if (!descriptor.grid) {
      return (
        <Row>
          <Col lg={12}>
            <br />
            <Alert bsStyle='danger'>
              No grid descriptor found for resource: {resource}
            </Alert>
          </Col>
        </Row>
      )
    }
    if (descriptor.grid.render) {
      return descriptor.grid.render.apply(this, [{
        descriptor: descriptor,
        resource: resource,
        params: params,
        token: token,
        list: list,
        grid: grid
      }])
    }
    else {
      return (
        <Grid
          grid={grid}
          descriptor={descriptor}
          resource={resource}
          token={token}
          list={list} />)
    }
  }
}
function mapToStateProps(state) {
  const { rest } = state
  const { list } = rest

  return {
    state,
    grid: {
      showFilters: false
    },
    rest: Object.assign(rest, {
      list: Object.assign({
        rows: [],
        count: 0,
        request: {
          page: 1,
          limit: 10,
          filters: []
        }
      }, list || {})
    })
  }
}
export default connect(mapToStateProps)(GridPage)
