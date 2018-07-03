import apisauce from 'apisauce'
import ticker, { validCryptoCurrencies, validFiatCurrencies } from './ticker'
import listings from './listings'

export { validCryptoCurrencies, validFiatCurrencies }

class Api {
  constructor (configuration = {}) {
    this.service = apisauce.create({
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      timeout: 10000,
      ...configuration
    })

    this.service.addMonitor((response) => {
      console.log('Api.response', { response })
      return response
    })

    this.ticker = ticker(this)
    this.listings = listings(this)

    console.log('Api.ctor', { configuration })
  }

  parseResponse (response) {
    if (response) {
      if (response.ok) {
        return response.data
      }
      if (response.data && response.data.error) {
        return {
          error: response.data.error.message || response.data.error.code || 'UNKNOW_ERROR'
        }
      }
      return {
        error: response.problem || 'UNKNOW_ERROR'
      }
    }
    return {
      error: 'NO_RESPONSE'
    }
  }

  parseException (exception) {
    if (exception) {
      if (exception.error && exception.code) {
        return exception
      }
      return {
        error: exception,
        code: 'EXCEPTION'
      }
    }
    return {
      error: 'Unknow exception',
      code: 'UNKNOW_EXCEPTION'
    }
  }

  get = (endpoint = '', data = {}, config = {}) => this.service.get(endpoint, data, config).then(this.parseResponse).catch(this.parseException);
}

export const api = new Api({ baseURL: 'https://api.coinmarketcap.com/v2' })
