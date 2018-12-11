import React, { PureComponent } from 'react';

// import SidebarTopic from '../sidebar/topic';

// style
import './index.scss';

export default class Box extends PureComponent {

  render() {

    const row = this.props.children.length;

    if (row == 3) {
      return (<div styleName="box">
          <div styleName="left">
            {this.props.children[0]}
          </div>
          <div>
            {this.props.children[1]}
          </div>
          <div styleName="right">
            {this.props.children[2]}
          </div>
        </div>)
    }

    return (<div styleName="box two">
        <div>
          {this.props.children[0]}
        </div>
        <div styleName="right">
          {this.props.children[1]}
        </div>
      </div>)
  }
}
