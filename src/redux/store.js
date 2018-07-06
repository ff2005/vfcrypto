import { createStore, applyMiddleware, compose } from 'redux'
import createAsyncEffectMiddleware from 'redux-async-effects'
import effectLogger from 'redux-async-effects-logger'
import { persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

export default (rootReducer, rootEffects) => {
  const middleware = []
  const enhancers = []
  const reducers = (state, action) => {
    return rootReducer(state, action)
  }

  if (process.env.NODE_ENV === `development`) {
    middleware.push(createLogger())
  }

  middleware.push(createAsyncEffectMiddleware(rootEffects, {
    log: (process.env.NODE_ENV === `development`) && effectLogger // ,
    // err: ({ error, action }) => {
    //   console.log('err', error, action)
    // },
    // options: {
    //   var1: 'var1'
    // }
  }))

  enhancers.push(applyMiddleware(...middleware))

  const store = createStore(reducers, undefined, compose(...enhancers))

  persistStore(store)

  return store
}
