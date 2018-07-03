import * as React from 'react'
import { connect } from 'react-redux'
import { mapReduxState, mapReduxDispatch } from 'redux-async-effects'
import { ApplicationSelector } from '../../redux'
import { withRouter, Link } from 'react-router-dom'
import { api } from '../../services'
import { toCurrency } from '../../helpers'
import './currency.css'

class Currency extends React.PureComponent {
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
    data && {
      id: data.id,
      name: data.name,
      symbol: data.symbol,
      rank: data.rank,
      cap: toCurrency(data.quotes[quote].market_cap, quote),
      volume: toCurrency(data.quotes[quote].volume_24h, quote),
      supply: {
        circulating: Number(data.circulating_supply).toLocaleString(),
        total: Number(data.total_supply).toLocaleString()
      }
    }

  getCoin = async (coin, quote) => {
    try {
      if (quote) {
        if (coin) {
          window.scrollTo(0, 0)
          this.setState({ loading: true })
          const info = await api.ticker.currency(coin, quote)
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
          throw new Error('Coin not found')
        }
      } else {
        throw new Error('No quote selected')
      }
    } catch (exception) {
      console.log('Currency.getCoin', { exception })
      this.setState({ loading: false, exception })
    }
  }

  componentDidMount () {
    this.getCoin(this.props.match && this.props.match.params && this.props.match.params.coin, this.props.quote)
  }

  componentWillReceiveProps (nextProps) {
    const nextQuote = nextProps && nextProps.quote
    const nextCoin = nextProps && nextProps.match && nextProps.match.params && nextProps.match.params.coin
    if (nextQuote && nextCoin && (nextQuote !== this.props.quote || nextCoin !== (this.props.match && this.props.match.params && this.props.match.params.coin))) {
      this.getCoin(nextCoin, nextQuote)
    }
  }

  renderClose () {
    return (
      <div className={'action-container'}>
        <div className={'action'}>
          <Link to={'/'}>x</Link>
        </div>
      </div>
    )
  }

  render () {
    console.log('Currency.render', { props: this.props, state: this.state, context: this.context })
    const { data, loading } = this.state
    if (loading) {
      return <div>Loading...</div>
    }
    if (data) {
      return (
        <div className={'currency'}>
          {this.renderClose()}
          <div className={'row'}>
            <div className={'info'}>
              <div className={'column'}>
                <div className={[ 'label', 'rank' ].join(' ')}>
                  <span className={'header'}>Rank</span>
                  <span className={'bubble'}>{data.rank}</span>
                </div>
              </div>
              <div className={'column'}>
                <div className={[ 'label', 'cap' ].join(' ')}>
                  <div className={'header'}>Market Cap</div>
                  <span className={'symbol'}>{data.cap.symbol}</span>
                  {data.cap.value}
                </div>
                <div className={[ 'label', 'circulating' ].join(' ')}>
                  <div className={'header'}>Circulating Supply</div>
                  {data.supply.circulating}
                  <span className={'quote'}>{data.symbol}</span>
                </div>
              </div>
              <div className={'column'}>
                <div className={[ 'label', 'volume' ].join(' ')}>
                  <div className={'header'}>24H Volume</div>
                  <span className={'symbol'}>{data.volume.symbol}</span>
                  {data.volume.value}
                </div>
                <div className={[ 'label', 'total' ].join(' ')}>
                  <div className={'header'}>Total Supply</div>
                  {data.supply.total}
                  <span className={'quote'}>{data.symbol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }
}

export default withRouter(connect(Currency.mapReduxStateToProps, Currency.mapReduxDispatchToProps)(Currency))
