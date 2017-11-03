import React, { Component } from 'react'
import { connect } from 'react-redux'
import File from './fields/File'


class FileUploader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ['ciao', 'pippo']
    }
  }
  render() {

    return (
      <div>
        <h1 className="page-header">File Uploader</h1>
        <File
          item={{}}
          field={{
            name: 'file',
            label: 'app.label.file'
          }}
          baseUrl={'http://dev.safeguard.network/rest/files/upload'}
          validationError={null}
          value={this.state.value || ''}
          multiple={true}
          onChange={(name, value) => this.setState({ value: value })} />
      </div>
    )
  }
}
export default connect(state => { return { state }})(FileUploader)
