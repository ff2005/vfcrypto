export default (api) => {
  return {
    currencies: (limit = 10, convert) => {
      if (limit && convert) {
        return api.get(`/ticker/?structure=array&${limit && 'limit=' + limit}&${convert && 'convert=' + convert}`)
      }
      return {}
    },
    currency: async (currency, convert) => {
      if (currency && convert) {
        const listings = await api.listings.listings()
        if (listings && listings[currency.toUpperCase()] && listings[currency.toUpperCase()].id) {
          return api.get(`/ticker/${listings[currency.toUpperCase()].id}/?${convert && 'convert=' + convert}`)
        }
      }
      return {}
    }
  }
}

export const validFiatCurrencies = [
  'AUD',
  'BRL',
  'CAD',
  'CHF',
  'CLP',
  'CNY',
  'CZK',
  'DKK',
  'EUR',
  'GBP',
  'HKD',
  'HUF',
  'IDR',
  'ILS',
  'INR',
  'JPY',
  'KRW',
  'MXN',
  'MYR',
  'NOK',
  'NZD',
  'PHP',
  'PKR',
  'PLN',
  'RUB',
  'SEK',
  'SGD',
  'THB',
  'TRY',
  'TWD',
  'ZAR'
]

export const validCryptoCurrencies = [ 'BTC', 'ETH', 'XRP', 'LTC', 'BCH' ]
