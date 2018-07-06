import { createReducer, createEffect } from 'redux-async-effects'
import { delay } from '../../helpers'

const NS = 'application'

const APPLICATION_INIT_STATE = {
  quote: 'EUR',
  refresh: 60,
  ttl: undefined
}

export const ApplicationTypes = {
  SET_QUOTE: `${NS}/SET_QUOTE`,
  SET_REFRESH: `${NS}/SET_REFRESH`,
  START_REFRESH: `${NS}/START_REFRESH`
}

export const ApplicationSelector = {
  quote: () => (state) => (state && state.application && state.application.quote),
  refreshTimeout: () => (state) => (state && state.application && state.application.refresh),
  refresh: () => (state) => ((state && state.application && state.application.refresh) === 0)
}

export const ApplicationAction = {
  setQuote: (quote) => ({ type: ApplicationTypes.SET_QUOTE, quote }),
  startRefresh: () => ({ type: ApplicationTypes.START_REFRESH })
}

export const ApplicationReducer = createReducer(APPLICATION_INIT_STATE, {
  [ApplicationTypes.SET_QUOTE]: ({ action, state }) => ({ ...state, quote: action.quote }),
  [ApplicationTypes.SET_REFRESH]: ({ action, state }) => ({ ...state, refresh: action.refresh })
})

const decrementRefresh = async ({ action, select, dispatch }) => {
  for (let refresh = 60; refresh >= 0; refresh--) {
    dispatch({ type: ApplicationTypes.SET_REFRESH, refresh })
    await delay(1000)
  }
  // if (await delay(1000)) {
  //   // const refresh = select(ApplicationSelector.refreshTimeout()) - 1
  //   // if (refresh >= 0) {
  //   //   dispatch({ type: ApplicationTypes.SET_REFRESH, refresh })
  //   // }
  // }
}

export const ApplicationEffect = createEffect({
  [ApplicationTypes.START_REFRESH]: decrementRefresh
})
