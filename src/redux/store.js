import { createStore, applyMiddleware, compose } from 'redux'
import { persistStore } from 'redux-persist'
import { createLogger } from 'redux-logger'

export default (rootReducer) => {
  const middleware = []
  const enhancers = []
  const reducers = (state, action) => {
    return rootReducer(state, action)
  }

  if (process.env.NODE_ENV === `development`) {
    middleware.push(createLogger())
  }

  enhancers.push(applyMiddleware(...middleware))

  const store = createStore(reducers, undefined, compose(...enhancers))

  persistStore(store)

  return store
}
