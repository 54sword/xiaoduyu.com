import React from 'react';
import './index.scss';

export default class Box extends React.PureComponent {
  render() {
    return (<div styleName="box">
        {this.props.children}
      </div>)
  }
}
