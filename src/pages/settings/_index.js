import React, { Component } from 'react';
import Loadable from 'react-loadable';
import loading from './loading.js';

const LoadableComponent = Loadable({
  loader: () => import('./main.js'),
  loading: loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent />;
  }
}
