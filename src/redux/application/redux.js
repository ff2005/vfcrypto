import { createReducer } from 'redux-async-effects'

const NS = 'application'

const APPLICATION_INIT_STATE = {
  quote: 'EUR'
}

export const ApplicationTypes = {
  SET_QUOTE: `${NS}/SET_QUOTE`,
  SET_UPDATER_TIMER: `${NS}/SET_UPDATER_TIMER`,
  START_UPDATER_TIMER: `${NS}/START_UPDATER_TIMER`
}

export const ApplicationSelector = {
  quote: () => (state) => state.application.quote
}

export const ApplicationAction = {
  setQuote: (quote) => ({ type: ApplicationTypes.SET_QUOTE, quote }),
  setUpdaterTimer: (sec) => ({ type: ApplicationTypes.SET_QUOTE, sec })
}

export const ApplicationReducer = createReducer(APPLICATION_INIT_STATE, {
  [ApplicationTypes.SET_QUOTE]: ({ action, state }) => ({ ...state, quote: action.quote })
})
