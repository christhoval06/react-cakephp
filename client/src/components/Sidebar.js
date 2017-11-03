import React, { Component } from 'react'
import { Glyphicon } from 'react-bootstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../system/Type'
import Menu from '../descriptors/Menu'

class Sidebar extends Component {
  static propTypes = {
    pathname: React.PropTypes.string
  }
  render() {
    const { state, pathname } = this.props
    const { auth } = state
    var selected = pathname
    var isInRole = (roles, role) => {
      return roles.find(r => r === role) != null
    }
    return (

      <ul className="nav nav-sidebar">
        {Menu.map((menuItem, index) => {
          if ((menuItem.allow && isFunction(menuItem.allow) && menuItem.allow(auth)) ||
            isInRole(menuItem.roles, auth.role)) {
            return (
              <li key={index}>
                <Link
                  to={menuItem.path}
                  className={selected === menuItem.path ? 'selected' : ''}>
                  <Glyphicon glyph={menuItem.icon} />
                  {' '}
                  <FormattedMessage
                    id={menuItem.label}
                    defaultMessage={menuItem.label} />
                </Link>
              </li>
            )
          }
          else return null
        })}
      </ul>
    )
  }
}

function mapToStateProps(state) {
  return { state }
}

export default connect(mapToStateProps)(Sidebar)
