import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getLastHistory } from '../../reducers/history'

import styles from './style.scss'

// 获取url中的参数，并返回
// new QueryString()
function QueryString() {
  var name,value,i;
  var str=location.href;
  var num=str.indexOf("?")
  str=str.substr(num+1);
  var arrtmp=str.split("&");
  for (i=0;i < arrtmp.length;i++) {
    num=arrtmp[i].indexOf("=");
    if(num>0) {
      name=arrtmp[i].substring(0,num);
      value=arrtmp[i].substr(num+1);
      this[name]=value;
    }
  }
}

export class SubNav extends Component {

  constructor(props) {
    super(props)
    this.navigateBack = this.navigateBack.bind(this)
  }

  navigateBack() {

    // 制定返回某个位置
    let { go } = this.props

    const { hasHistory } = this.props

    if (!hasHistory) {
      browserHistory.push('/')
    } else {
      if (typeof go != 'undefined' && !isNaN(go)) {
        this.context.router.go(go)
      } else {
        this.context.router.goBack()
      }
    }

  }

  render() {
    
    const { left = '返回', middle = '', right = '' } = this.props
    let back = <a href="javascript:;" onClick={this.navigateBack}>{left}</a>

    if (typeof window == 'undefined' || typeof document == 'undefined') {
    } else {
      let params = new QueryString()
      if (params.subnav_back) {
        back = <Link to={params.subnav_back}>{left}</Link>
      }
    }

    return (
      <div>
        <div className={styles.subnav}>
          <div className="container">
            <div>{back}</div>
            <div>{middle}</div>
            <div>{right}</div>
          </div>
        </div>
        {/* 占位 */}
        <div className={styles.placeholder}></div>
      </div>
    )
  }
}

SubNav.contextTypes = {
  router: PropTypes.object.isRequired
}

SubNav.propTypes = {
  hasHistory: PropTypes.bool.isRequired
}

function mapStateToProps(state, props) {
  return {
    hasHistory: getLastHistory(state) ? true : false
  }
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

SubNav = connect(mapStateToProps, mapDispatchToProps)(SubNav)

export default SubNav
