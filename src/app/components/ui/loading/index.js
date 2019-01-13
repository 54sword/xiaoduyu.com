import React, { PureComponent } from 'react';

import './style.scss';

export default class LoadingMore extends PureComponent {

  render() {

    const { text = '' } = this.props

    return <div styleName="loading"><span></span>{text}</div>
  }

}
