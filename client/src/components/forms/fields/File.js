import { connect } from 'react-redux'
import React, { Component } from 'react'
import {
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  InputGroup,
  Button,
  ProgressBar,
  ListGroup,
  ListGroupItem,
  Glyphicon,
  Alert
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { isFunction } from '../../../system/Type'
import FileUpload from 'react-fileupload'

class Field extends Component {
  static propTypes = {
    field: React.PropTypes.object.isRequired,
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.array
    ]),
    help: React.PropTypes.string,
    validationError: React.PropTypes.shape({
      code: React.PropTypes.number,
      field: React.PropTypes.string.isRequired,
      message: React.PropTypes.string.isRequired
    }),
    onChange: React.PropTypes.func.isRequired,
    onProgress: React.PropTypes.func,
    multiple: React.PropTypes.bool,
    baseUrl: React.PropTypes.string.isRequired
  }
  constructor(props) {
    super(props)

    this.state = {
      uploading: false,
      progress: 0
    }
  }

  change(evt) {
    const { field } = this.props
    this.props.onChange(field.name, evt.target.value)
  }

  render() {
    const { multiple, field, value, validationError } = this.props
    let options = {
      baseUrl: this.props.baseUrl,
      chooseAndUpload: true,
      beforeUpload: (files, mil) => {
        this.setState({
          uploading: true,
          progress: 0
        })
        return true
      },
      uploading: progress => {
        var p = parseInt((100 / progress.total) * progress.loaded, 10)
        this.setState({ progress: p })
      },
      uploadSuccess: response => {
        this.setState({
          uploading: false,
          progress: 0
        })
        if (this.props.multiple) {
          var files = response.files.map(f => f.filepath)
          if (value && value.length) {
            files = files.concat(value)
          }
          this.props.onChange(field.name, files)
        }
        else {
          this.props.onChange(field.name, response.files[0].filepath)
        }
      }
    }
    var additionalProps = {}
    if (validationError != null) {
      additionalProps.validationState = 'error'
    }
    var label = field.label
    if (isFunction(label)) {
      label = label.apply(this)
    }
    else {
      label = (
        <FormattedMessage
          id={label}
          defaultMessage={label} />
      )
    }
    var help = field.help
    if (help) {
      if (isFunction(help)) {
        help = help.apply(this)
      }
      else {
        help = (
          <FormattedMessage
            id={help}
            defaultMessage={help} />
        )
      }
    }
    return (
      <FormGroup controlId={field.name} {...additionalProps}>
        <ControlLabel>{label}</ControlLabel>
        <InputGroup>
          <FormControl
            type='text'
            readOnly={true}
            value={(!multiple && value) || ''}
            onChange={this.change.bind(this)}/>
          <InputGroup.Button>
            <FileUpload
              id="file-upload"
              options={options}>
              <Button
                ref="chooseAndUpload"
                bsStyle='default'
                className="btn-addon-upload">
                {'Choose'}
              </Button>
            </FileUpload>
          </InputGroup.Button>
        </InputGroup>
        {help && <HelpBlock>{help}</HelpBlock>}
        {validationError && <HelpBlock>{validationError.message}</HelpBlock>}
        {this.state.uploading && <br />}
        {this.state.uploading &&
          <ProgressBar
            active
            now={this.state.progress}
            label={`${this.state.progress}%`} />
        }
        {multiple && value.length > 0 && <br />}
        {multiple &&
          <ListGroup>
            {value && value.length > 0 && value.map((file, index) =>
              <ListGroupItem key={index}>
                <a href={"/" + file}>{file}</a>
                <Button
                  bsStyle="danger"
                  bsSize="xsmall"
                  className="pull-right"
                  onClick={() => {
                    var newValues = value.filter(v => v !== file)
                    this.props.onChange(field.name, newValues)
                  }}>
                  <Glyphicon glyph="remove" />
                </Button>
              </ListGroupItem>
            )}
          </ListGroup>
        }
        {multiple && value.length === 0 &&
          <Alert bsStyle='info'>
            <FormattedMessage id="app.label.no_file" />
          </Alert>
        }
      </FormGroup>
    )
  }
}

function mapToStateProps(state) {
  return {
    state
  }
}
export default connect(mapToStateProps)(Field)
