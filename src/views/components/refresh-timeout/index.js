import * as React from 'react'
import { connect } from 'react-redux'
import { mapReduxState, mapReduxDispatch } from 'redux-async-effects'
import { ApplicationSelector } from '../../../redux'
import './index.css'

export class RefreshTimeout extends React.PureComponent {
  static mapReduxStateToProps = mapReduxState(({ select }) => ({
    timeout: select(ApplicationSelector.refreshTimeout())
  }))

  static mapReduxDispatchToProps = mapReduxDispatch(({ dispatch }) => ({
  }))

  render () {
    console.log('RefreshTimeout.render', { props: this.props, state: this.state, context: this.context })
    const { timeout } = this.props
    return (
      <div>
        {timeout}
      </div>
    )
  }
}

export default connect(RefreshTimeout.mapReduxStateToProps, RefreshTimeout.mapReduxDispatchToProps)(RefreshTimeout)
