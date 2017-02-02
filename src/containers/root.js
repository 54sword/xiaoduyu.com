import React from 'react';
import { Provider, connect } from 'react-redux';
import createRouter from '../routes'
import { debug, GA } from '../../config'

import './global/global.scss'

import ReactGA from 'react-ga'

let logPageView = ()=>{}

if (!debug) {
  ReactGA.initialize(GA)
  logPageView = () => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
}

export default class Root extends React.PureComponent {
  render() {
    const { store, history, signinStatus } = this.props
    return (
      <Provider store={store}>
        {createRouter(history, signinStatus, logPageView)}
      </Provider>
    )
  }
}
