import { DEBUG } from '../config'
import { createStore, applyMiddleware } from 'redux'
import { combineReducers } from 'redux'
import { reducer as notificationsReducer } from 'react-notification-system-redux'

import thunk from 'redux-thunk'
import { intlReducer } from 'react-intl-redux'
import createLogger from 'redux-logger'
import appReducer from '../reducers/App'
import authReducer from '../reducers/Auth'
import restReducer from '../reducers/Rest'
import formReducer from '../reducers/Form'
import gridReducer from '../reducers/Grid'
import userReducer from '../reducers/User'
import modalReducer from '../reducers/Modal'
import routerReducer from '../reducers/Router'
import consoleReducer from '../reducers/Console'
import subscriptionReducer from '../reducers/Subscription'

const loggerMiddleware = createLogger({
  predicate: (getState, action) => DEBUG
})

export default function configureStore(preloadedState) {
  return createStore(
    combineReducers({
      app: appReducer,
      intl: intlReducer,
      auth: authReducer,
      rest: restReducer,
      form: formReducer,
      grid: gridReducer,
      user: userReducer,
      modal: modalReducer,
      router: routerReducer,
      console: consoleReducer,
      subscription: subscriptionReducer,
      notifications: notificationsReducer
    }),
    preloadedState,
    applyMiddleware(thunk, loggerMiddleware)
  )
}
