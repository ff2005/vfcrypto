import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createStore from './store'

import { ApplicationAction, ApplicationSelector, ApplicationReducer } from './application/redux'

export { ApplicationAction, ApplicationSelector }

const config = {
  debug: process.env.NODE_ENV === `development`,
  key: 'vfcrypto',
  storage,
  version: 1.0
}

export default () => {
  const rootReducer = persistCombineReducers(config, {
    action: (state = null, { type }) => type,
    application: ApplicationReducer
  })

  return createStore(rootReducer)
}
