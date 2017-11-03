import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-intl-redux'
import { Router, Route, hashHistory, IndexRedirect } from 'react-router'
import configureStore from './stores'
import App from './App'
import components from './components'

import { addLocaleData } from 'react-intl'
import itLocaleData from 'react-intl/locale-data/it'
import enLocaleData from 'react-intl/locale-data/en'
import moment from 'moment'
addLocaleData([
  ...itLocaleData,
  ...enLocaleData,
])


import itTranslations from './locale/it'
import enTranslations from './locale/en'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import 'react-select/dist/react-select.css'
import 'react-datetime/css/react-datetime.css'
import 'codemirror/lib/codemirror.css'
import 'animate.css'
import './index.css'

var translations = {
  it: itTranslations,
  en: enTranslations
}
var lang = navigator.language.substring(0, 2)
var href = window.location.href
var sharp = href.indexOf('/#/')
if (sharp !== -1) {
  href = href.substring(0, sharp)
  sharp = href.lastIndexOf('/')
  if (sharp !== -1) {
    lang = href.substring(sharp + 1)
    if (lang.length > 2) {
      lang = lang.substring(0, 2)
    }
  }
}
var target = /*translations[lang] || */enTranslations
const store = configureStore({
  intl: target
})
moment.locale(/*lang || */'en')

ReactDOM.render(
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/login" component={components.LoginPage} />
      <Route path="/" component={App}>
        <IndexRedirect to="/console" />
        <Route path="/console" component={components.ConsolePage} />
        <Route path="/config" component={components.ConfigPage} />
        <Route path="/campaign-tester" component={components.CampaignTester} />
        <Route path="/file-uploader" component={components.FileUploader} />
        <Route path="/:resource/grid" component={components.GridPage} />
        <Route path="/:resource/:action" component={components.FormPage} />
        <Route path="/:resource/:action/:id" component={components.FormPage} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
