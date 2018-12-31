import React, { PureComponent } from 'react';

import './index.scss';

export default class LoadingMore extends PureComponent {

  render() {

    const { text = '加载中...' } = this.props

    return <div styleName="loading"><span></span>{text}</div>
  }

}
