import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { mapReduxState, mapReduxDispatch } from 'redux-async-effects'
import { ApplicationSelector, ApplicationAction } from '../../../redux'
import { validFiatCurrencies } from '../../../services'
import './index.css'

export class Header extends React.PureComponent {
  static mapReduxStateToProps = mapReduxState(({ select }) => ({
    quote: select(ApplicationSelector.quote())
  }))

  static mapReduxDispatchToProps = mapReduxDispatch(({ dispatch }) => ({
    setQuote: (quote) => dispatch(ApplicationAction.setQuote(quote))
  }))

  handleCurrencyChange = (event) => {
    console.log('Header.handleCurrencyChange', { event, value: event.target.value })
    const quote = event && event.target && event.target.value
    if (quote) {
      this.props.setQuote(quote)
    }
  }

  render () {
    console.log('Header.render', { props: this.props, state: this.state, context: this.context })
    const { quote } = this.props
    return (
      <header>
        <div className={'layout-left'}>
          <Link to={'/'}>
            <h1 className={'title'}>VFCrypto</h1>
          </Link>
        </div>
        <div className={'layout-right'}>
          <select className={'quote'} onChange={this.handleCurrencyChange} value={quote}>
            {validFiatCurrencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </header>
    )
  }
}

export default connect(Header.mapReduxStateToProps, Header.mapReduxDispatchToProps)(Header)
