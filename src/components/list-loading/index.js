import React, { Component, PropTypes } from 'react'

import styles from './style.scss'

class ListLoading extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  render () {

    const { loading, more, handleLoad = ()=>{} } = this.props

    let dom
    
    if (loading && more) {
      dom = '正在加载...'
    } else if (!loading && more) {
      dom = <a href="javascript:void(0)" onClick={handleLoad}>点击加载更多</a>
    } else if (!more) {
      dom = '没有更多'
    }

    return (<div className={styles.box}>{dom}</div>)
  }

}

export default ListLoading
