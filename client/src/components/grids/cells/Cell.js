import React, { Component } from 'react'

class Cell extends Component {
  propTypes: {
    dispatch: React.PropType.object.isRequired,
    endpoint: React.PropType.string.isRequired,
    resource: React.PropType.string.isRequired,
    column: React.PropType.object.isRequired,
    row: React.PropType.object.isRequired,
    value: React.PropType.object
  }
  render() {
    const { value } = this.props
    return (<span>{value}</span>)
  }
}
export default Cell
