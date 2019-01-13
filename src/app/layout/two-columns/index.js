import React from 'react';
import './index.scss';

export default class Box extends React.PureComponent {
  
  render() {
    return (<div styleName="box">
        <div>
          {this.props.children[0]}
        </div>
        <div styleName="right">
          {this.props.children[1]}
        </div>
      </div>)
  }
}
