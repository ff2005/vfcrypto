import * as React from 'react'
import { connect } from 'react-redux'
import { mapReduxState, mapReduxDispatch } from 'redux-async-effects'
import { ApplicationSelector } from '../../redux'
import { Link } from 'react-router-dom'
import { api } from '../../services'
import { toCurrency } from '../../helpers'
import './currencies.css'

class Currencies extends React.PureComponent {
  static mapReduxStateToProps = mapReduxState(({ select }) => ({
    quote: select(ApplicationSelector.quote())
  }))

  static mapReduxDispatchToProps = mapReduxDispatch(({ dispatch }) => ({}))

  state = {
    data: undefined,
    loading: false
  }

  parseMetadata = (metadata) => ({
    ...metadata,
    timestamp: new Date(metadata.timestamp * 1000)
  })

  parseData = (data, quote) =>
    Object.keys(data).map((key, index) => ({
      index: index + 1,
      id: data[key].id,
      name: data[key].name,
      price: toCurrency(data[key].quotes[quote].price, quote),
      cap: toCurrency(data[key].quotes[quote].market_cap, quote),
      change: Math.round(parseFloat(data[key].quotes[quote].percent_change_24h) * 100) / 100
    }))

  getCoins = async (quote) => {
    try {
      if (quote) {
        this.setState({ loading: true })
        const info = await api.ticker.currencies(10, quote)
        if (info && info.data) {
          this.setState({
            metadata: this.parseMetadata(info.metadata),
            data: this.parseData(info.data, quote),
            quote,
            loading: false
          })
        } else {
          throw new Error('Invalid data')
        }
      } else {
        throw new Error('No quote selected')
      }
    } catch (exception) {
      console.log('Currencies.getCoins', { exception })
      this.setState({ loading: false, exception })
    }
  }

  componentDidMount () {
    this.getCoins(this.props.quote)
  }

  componentWillReceiveProps (nextProps) {
    console.log('Currencies.componentWillReceiveProps', { props: this.props, nextProps })
    const nextQuote = nextProps && nextProps.quote
    if (nextQuote && nextQuote !== this.props.quote) {
      this.getCoins(nextQuote)
    }
  }

  renderHeader () {
    return (
      <div className={[ 'row', 'header' ].join(' ')}>
        <div className={'info'}>
          <div className={[ 'label', 'name' ].join(' ')}>Cryptocurrency</div>
          <div className={[ 'label', 'price' ].join(' ')}>Price</div>
          <div className={[ 'label', 'cap' ].join(' ')}>Market Cap</div>
          <div className={[ 'label', 'change' ].join(' ')}>24H Change</div>
        </div>
      </div>
    )
  }

  render () {
    console.log('Currencies.render', { props: this.props, state: this.state, context: this.context })
    const { data, loading } = this.state
    const size = 16
    if (loading) {
      return <div>Loading...</div>
    }
    if (data) {
      return (
        <div className={'currencies'}>
          {this.renderHeader()}
          {data.map(
            (coin) =>
              (coin && (
                <Link key={coin.id} to={`/${coin.name}`}>
                  <div className={'row'}>
                    <div className={'info'}>
                      <div className={[ 'label', 'name' ].join(' ')}>
                        <div className={'header'}>Cryptocurrency</div>
                        <span className={'index'}>{coin.index}</span>
                        <img src={`https://s2.coinmarketcap.com/static/img/coins/${size}x${size}/${coin.id}.png`} alt={coin.name} height={size} width={size} />
                        {coin.name}
                      </div>
                      <div className={[ 'label', 'price' ].join(' ')}>
                        <div className={'header'}>Price</div>
                        <span className={'symbol'}>{coin.price.symbol}</span>
                        {coin.price.value}
                      </div>
                      <div className={[ 'label', 'cap' ].join(' ')}>
                        <div className={'header'}>Market Cap</div>
                        <span className={'symbol'}>{coin.price.symbol}</span>
                        {coin.cap.value}
                      </div>
                      <div className={[ 'label', 'change', coin.change > 0 ? 'positive' : coin.change < 0 ? 'negative' : 'equal' ].join(' ')}>
                        <div className={'header'}>24H Change</div>
                        {coin.change}%
                      </div>
                    </div>
                  </div>
                </Link>
              )) ||
              null
          )}
        </div>
      )
    }
    return null
  }
}

export default connect(Currencies.mapReduxStateToProps, Currencies.mapReduxDispatchToProps)(Currencies)
