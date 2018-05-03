import React, { Component } from 'react'

import CSSModules from 'react-css-modules'
import styles from './style.scss'


@CSSModules(styles)
export default class LoadingMore extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { text = '正在加载中...' } = this.props

    return <div styleName="loading"><span></span>{text}</div>
  }

}
