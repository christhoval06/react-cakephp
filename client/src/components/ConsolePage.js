import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import {
  Alert,
  PageHeader,
  Button,
  Glyphicon,
  ButtonGroup,
  Row,
  Col,
  Panel,
  Table,
  Breadcrumb,
  FormGroup,
  FormControl,
  InputGroup,
} from 'react-bootstrap'
import { getData } from '../actions/Console'
import { Link } from 'react-router'
import { long2ip } from '../system/Networking'
import {
  updateWhiteListUrl,
  removeWhiteListUrl,
  createWhiteListUrl
} from '../actions/Auth'
import {
  updateProp
} from '../actions/User'

class ConsolePage extends Component {
  componentDidMount() {
    this.refresh()
  }

  refresh() {
    const { dispatch, state } = this.props
    const { auth, intl } = state
    const { locale } = intl
    const { token } = auth
    dispatch(getData({ token, lang: locale }))
  }

  updateWhiteListUrl(index, value) {
    const { dispatch } = this.props
    dispatch(updateWhiteListUrl(index, value))
  }
  removeWhiteListUrl(index) {
    const { dispatch } = this.props
    dispatch(removeWhiteListUrl(index))
  }
  createWhiteListUrl() {
    const { dispatch } = this.props
    dispatch(createWhiteListUrl())
  }
  changeWhiteListUrl() {
    const { dispatch, state } = this.props
    const { auth } = state
    dispatch(updateProp({
      token: auth.token,
      name: 'network_url_whitelist',
      value: auth.network_url_whitelist
    }))
  }

  render() {
    const { state } = this.props
    const { auth } = state
    var data = state.console && state.console.data
      ? state.console.data
      : {}

    // This control checks if whitelist is blank.
    // Only if is blank we have to manage the state and merge vars.

    return (
      <div>
        <PageHeader>
          <FormattedMessage id="app.label.console" />
          <ButtonGroup className="pull-right">
            <Button
              bsStyle="success"
              onClick={this.refresh.bind(this)}>
              <Glyphicon glyph="refresh" />
              &nbsp;
              <FormattedMessage
                id='app.grid.button.refresh'
                defaultMessage='Refresh' />
            </Button>
          </ButtonGroup>
        </PageHeader>
        <Breadcrumb>
          <Breadcrumb.Item href="#">
            <FormattedMessage id="app.grid.breadcrumb.table" />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <FormattedMessage id="app.label.console" />
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          {data.indicators && data.indicators.map((indicator, index) =>
            <Col lg={3} md={3} sm={6} xs={12} key={index}>
              <Panel
                bsStyle={indicator.theme}
                className="animated fadeIn"
                header={
                  <Row>
                    <Col xs={3}>
                      <Glyphicon glyph={indicator.glyph} style={{ fontSize: '5em' }} />
                    </Col>
                    <Col xs={9} className="text-right">
                      <h1>{indicator.value}</h1>
                      <p>{indicator.name}</p>
                    </Col>
                  </Row>
                }
                footer={
                  <div>
                    <Link
                      className="btn-block"
                      to={indicator.link}>
                      {indicator.linkLabel || <FormattedMessage id="app.label.view_details" />}
                      <Glyphicon glyph="circle-arrow-right" className="pull-right" />
                    </Link>
                  </div>
                }/>
            </Col>
          )}
        </Row>
        <Row>
          {data.tables && data.tables.map((table, index) =>
            <Col lg={6} md={12} key={index}>
              <Panel header={<span><Glyphicon glyph={table.icon} />{' '}{table.title}</span>}>
                <Table striped>
                  <thead>
                    <tr>
                      {table.columns.map((column, index) =>
                        <th key={index}>
                          <FormattedMessage id={'app.label.' + column} />
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                  {table.rows.map((row, index) =>
                    <tr key={index}>
                    {table.columns.map((column, index) =>
                      <td key={index}>
                        {column === 'url' && <a href={row[column]} target="_blank">{row[column]}</a>}
                        {column !== 'url' && column === 'ip' && long2ip(row[column])}
                        {column !== 'url' && column !== 'ip' && row[column] && row[column] != null && row[column]}
                        {column !== 'url' && column !== 'ip' && row[0] && row[0][column]}
                      </td>
                    )}
                    </tr>
                  )}
                  </tbody>
                </Table>
                {table.rows.length === 0 &&
                  <Alert bsStyle='info'>
                    <FormattedMessage id="app.label.no_data" />
                  </Alert>
                }
              </Panel>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

function mapToStateProps(state) {
  const { console } = state
  return {
    state,
    console: Object.assign({
      data: {
        indicators: [],
        tables: []
      }
    }, console)
  }
}

export default connect(mapToStateProps)(ConsolePage)
