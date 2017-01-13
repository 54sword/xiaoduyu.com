import React from 'react';
import { Provider, connect } from 'react-redux';
import createRouter from '../routes'

import './global/global.scss'

import ReactGA from 'react-ga'
ReactGA.initialize('UA-87680851-1')

function logPageView() {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
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
