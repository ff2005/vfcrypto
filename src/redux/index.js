import { persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineEffects } from 'redux-async-effects'
import createStore from './store'

import { ApplicationAction, ApplicationSelector, ApplicationReducer, ApplicationEffect } from './application/redux'

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

  const rootEffects = combineEffects(
    ApplicationEffect
  )

  return createStore(rootReducer, rootEffects)
}
