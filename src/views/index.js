import * as React from 'react'
import { Provider } from 'react-redux'
import createStore from '../redux'
import { BrowserRouter, Route } from 'react-router-dom'
import { Header } from './components'
import Currencies from './currencies/currencies'
import Currency from './currency/currency'
import './index.css'

const store = createStore()

export class App extends React.PureComponent {
  render () {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className={'app'}>
            <Header />
            {/* <Switch> */}
            <Route path={'/:coin'} component={Currency} />
            <Route component={Currencies} />
            {/* </Switch> */}
          </div>
        </BrowserRouter>
      </Provider>
    )
  }
}
