import React, { PureComponent } from 'react'

// style
import './index.scss';

export default class Box extends PureComponent {

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
