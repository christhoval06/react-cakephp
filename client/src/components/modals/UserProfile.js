import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Button,
  Alert
} from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { reset, updateProfile } from '../../actions/User'
import { buyPackage } from '../../actions/Subscription'
import Field from '../forms/fields/Field'
import Select from '../forms/fields/Select'
import Autocomplete from '../forms/fields/Autocomplete'
import { load } from '../../actions/Rest'
import { endpoint } from '../../config'


/**
 * Build single field configuration.
 * The fastest way to build it.
 */
let field = (label, type) => {
  return {
    label: label,
    type: type
  }
}
var typeForm = {
  'private': {
    'name': field('app.label.name', 'string'),
    'surname': field('app.label.surname', 'string'),
    'address': field('app.label.address', 'string'),
    'city_id': field('app.label.city', 'municipality'),
    'zip_code': field('app.label.zip_code', 'string'),
    'province_id': field('app.label.province', 'municipality'),
    'fiscal_code': field('app.label.fiscal_code', 'string')
  },
  'company': {
    'name': field('app.label.company_name', 'string'),
    'address': field('app.label.address', 'string'),
    'city_id': field('app.label.city', 'municipality'),
    'zip_code': field('app.label.zip_code', 'string'),
    'province_id': field('app.label.province', 'municipality'),
    'vat_number': field('app.label.vat_number.it', 'string'),
    'fiscal_code': field('app.label.fiscal_code', 'string')
  },
  'foreign_company': {
    'name': field('app.label.company_name', 'string'),
    'address': field('app.label.legal_address', 'string'),
    'vat_number': field('app.label.vat_number.company', 'string'),
    'country_id': field('app.label.country', 'country')
  },
  'foreign_private': {
    'name': field('app.label.name', 'string'),
    'surname': field('app.label.surname', 'string'),
    'address': field('app.label.address', 'string'),
    'vat_number': field('app.label.vat_number.private', 'string'),
    'country_id': field('app.label.country', 'country')
  }
}

const EMPTY_PROFILE = {
  type: 'private',
  city_id: null,
  province_id: null,
  birth_city_id: null,
  country_id: null,
  name: '',
  surname: '',
  fiscal_code: '',
  address: '',
  zip_code: '',
  vat_number: ''
}


class UserProfile extends Component {
  static propTypes = {
    visible: React.PropTypes.bool.isRequired,
    profile: React.PropTypes.object
  }
  constructor(props) {
    super(props)
    this.state = { profile: EMPTY_PROFILE }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.visible) {
      this.setState({ profile: EMPTY_PROFILE })
    }
    else if (nextProps.visible && nextProps.visible !== this.props.visible) {
      var profile = Object.assign({}, EMPTY_PROFILE, nextProps.profile)
      this.setState({ profile })
    }
    if (!nextProps.visible && this.props.visible &&
        this.props.state.user.executeProcess === 'updateProfile' &&
        this.props.state.user.executeStatus === 'success') {
      /**
       * This situation is intented to handle a specific behavior:
       * User updates his profile, the background process is completed with success
       * and now he wants to buy the package targeted before update.
       *
       * The field this.props right now contains a copy of arguments that can be proessed
       * before an hard reset is executed.
       */
      const { dispatch, state } = this.props
      const { user, auth } = state
      const { token } = auth
      const { shouldChangeProfileArgs} = user
      if (shouldChangeProfileArgs && shouldChangeProfileArgs.packageId > 0) {
        let id = shouldChangeProfileArgs.packageId
        let coupon = shouldChangeProfileArgs.coupon
        dispatch(buyPackage({ token, id, coupon }))
      }
    }
  }


  changeProp(name, value) {
    var profile = this.state.profile
    profile[name] = value
    this.setState({ profile })
  }
  render() {
    const { visible, state } = this.props
    const { user, intl, rest } = state
    const { profile } = this.state
    const { type } = profile
    var args = user.shouldChangeProfileArgs
    var form = typeForm[type]
    let mapList = (prefix, name, label) => {
      var n = prefix + '_' + name
      if (rest.load && rest.load[n]) {
        return rest.load[n].rows.map(r => {
          return { label: r.name, value: r.id }
        })
      }
      let profile = this.state.profile
      if (profile[name] && profile[label]) {
        return [{
          label: profile[label],
          value: profile[name]
        }]
      }
      return []
    }

    let municipalities = {
      city_id: mapList('municipalities', 'city_id', 'city_name'),
      province_id: mapList('municipalities', 'province_id', 'province_name'),
      birth_city_id: mapList('municipalities', 'birth_city_id', 'birty_city_name')
    }
    let countries = {
      country_id: mapList('countries', 'country_id', 'country_name')
    }

    var errors = user.validationErrors || []
    var typeOptions = Object.keys(typeForm).map(type => {
      return {
        value: type,
        label: intl.messages['app.label.user_profile_type.' + type]
      }
    })
    return (
      <Modal show={visible}>
        <Modal.Header>
          <Modal.Title>
            <FormattedMessage id="app.label.change_profile" />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            {args && args.packageId > 0 &&
              <Alert bsStyle='info'>
                <FormattedMessage id="app.label.fill_profile_to_pay" />
              </Alert>
            }
            <Select
              key='type'
              name='type'
              field={{
                name: 'type',
                label: 'app.label.user_profile_type'
              }}
              options={typeOptions}
              value={type}
              validationError={errors.find(e => e.field === 'type')}
              onChange={this.changeProp.bind(this)} />
            {form && Object.keys(form).map(name => {
              let field = form[name]
              switch(field.type) {
                case 'string':
                  return (
                    <Field
                      key={name}
                      name={name}
                      field={{
                        name: name,
                        label: field.label
                      }}
                      value={this.state.profile[name]}
                      validationError={errors.find(e => e.field === name)}
                      onChange={this.changeProp.bind(this)} />
                  )
                case "municipality":
                  return (
                    <Autocomplete
                      key={name}
                      name={name}
                      field={{
                        name: name,
                        label: field.label
                      }}
                      value={this.state.profile[name]}
                      validationError={errors.find(e => e.field === name)}
                      options={municipalities[name]}
                      onChange={this.changeProp.bind(this)}
                      onInputChange={(value) => {
                        if(value && value.length > 3) {
                          const { dispatch } = this.props
                          var resource = endpoint('municipality')
                          var request = {
                            limit: 100,
                            page: 1,
                            sort: {
                              column: 'name',
                              descending: false
                            },
                            filters: [{
                              name: "name",
                              clause: "sw",
                              value: value
                            }]
                          }
                          dispatch(load(resource, request, 'municipalities_' + name))
                        }
                      }} />
                  )
                case "country":
                  return (
                    <Autocomplete
                      key={name}
                      name={name}
                      field={{
                        name: name,
                        label: field.label
                      }}
                      value={this.state.profile[name]}
                      validationError={errors.find(e => e.field === name)}
                      options={countries[name]}
                      onChange={this.changeProp.bind(this)}
                      onInputChange={(value) => {
                        if(value && value.length > 3) {
                          const { dispatch } = this.props
                          var resource = endpoint('country')
                          var request = {
                            limit: 100,
                            page: 1,
                            filters: [{
                              name: "name",
                              clause: "like",
                              value: value
                            }]
                          }
                          dispatch(load(resource, request, 'countries_' + name))
                        }
                      }} />
                  )
                default:
                  return null
              }
            })}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={user.operationInProgress}
            bsStyle='default'
            onClick={this.close.bind(this)}>
            <FormattedMessage id="app.label.close" />
          </Button>
          <Button
            disabled={user.operationInProgress}
            bsStyle='primary'
            onClick={this.submit.bind(this)}>
            <FormattedMessage id="app.label.update" />
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
  close() {
    const { dispatch } = this.props
    dispatch(reset())
  }
  submit() {
    const { dispatch, state } = this.props
    const { auth } = state
    const { token } = auth

    let request = Object.assign({ token }, this.state.profile)
    dispatch(updateProfile(request))
  }
}
export default connect(state => { return { state }})(UserProfile)
