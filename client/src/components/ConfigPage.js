import React, { Component } from 'react'
import {
  PageHeader,
  Row,
  Col,
  Panel,
  Glyphicon,
  Breadcrumb
}
from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { connect } from 'react-redux'
import { Link } from 'react-router'

let panels = [{
  icon: 'cog',
  name: 'app.label.config.system',
  items: [{
    name: 'app.label.config.system.shell_tasks',
    link: '/shell-task/grid'
  }, {
    name: 'app.label.app_settings',
    link: '/app-setting/grid'
  }, {
    name: 'app.label.landing_section',
    link: '/landing-section/grid'
  }, {
    name: 'app.label.blog_resource_link',
    link: '/blog-resource-link/grid'
  }]
},{
  icon: 'lock',
  name: 'app.label.config.security',
  items: [{
    name: 'app.label.config.users',
    link: '/user/grid'
  }]
}, {
  icon: 'globe',
  name: 'app.label.config.networking',
  items: [{
    name: 'app.label.config.ip_range',
    link: '/ip-range/grid'
  },{
    name: 'app.label.config.ip_range_group',
    link: '/ip-range-group/grid'
  }, {
    name: 'app.label.config.ip_range_category',
    link: '/ip-range-category/grid'
  }, {
    name: 'app.label.config.ip_range_group_set',
    link: '/ip-range-group-set/grid'
  }]
}, {
  icon: 'tasks',
  name: 'app.label.config.campaign',
  items: [{
    name: 'app.label.config.traffic_source',
    link: '/traffic-source/grid'
  }]
}, {
  icon: 'euro',
  name: 'app.label.config.payments',
  items: [{
    name: 'app.label.config.coupons',
    link: '/subscription-coupon/grid'
  }]
}]

class ConfigPage extends Component {
  render() {
    return (
      <div>
        <PageHeader>
          <FormattedMessage id="app.label.config" />
        </PageHeader>
        <Breadcrumb>
          <Breadcrumb.Item href="#">
            <FormattedMessage id="app.name" />
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <FormattedMessage id="app.label.config" />
          </Breadcrumb.Item>
        </Breadcrumb>
        <Row>
          {panels.map((panel, index) =>
            <Col key={index} lg={4} md={4} sm={6} xs={12} className="animated fadeInUp">
              <Panel header={<FormattedMessage id={panel.name} />}>
                <Row>
                  <Col lg={2} md={2} smHidden xsHidden>
                    <Glyphicon glyph={panel.icon} style={{ fontSize: '5em' }}/>
                  </Col>
                  <Col lg={10} md={10} sm={12} xs={12}>
                    <ul style={{ listStyleType: 'none' }}>
                    {panel.items.map((item, index) =>
                      <li key={index}>
                        <Link to={{ pathname: item.link }}>
                          <FormattedMessage id={item.name} />
                        </Link>
                      </li>
                    )}
                    </ul>
                  </Col>
                </Row>
              </Panel>
            </Col>
          )}
        </Row>
      </div>
    )
  }
}

export default connect(state => { return { state }})(ConfigPage)
