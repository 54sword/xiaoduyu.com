import React from 'react';
import { Provider, connect } from 'react-redux';
import createRouter from '../routes'
import { debug, GA } from '../../config'

import './global/global.scss'

import ReactGA from 'react-ga'

let logPageView = ()=>{}

if (GA) {
  ReactGA.initialize(GA)
  logPageView = (userinfo) => {
    let option = { page: window.location.pathname }
    if (userinfo && userinfo._id) option.userId = userinfo._id
    ReactGA.set(option)
    ReactGA.pageview(window.location.pathname)
  }
}

export default class Root extends React.PureComponent {
  render() {
    const { store, history, signinStatus } = this.props
    return (
      <Provider store={store}>
        {createRouter(history, signinStatus, ()=>{ logPageView(signinStatus) })}
      </Provider>
    )
  }
}
