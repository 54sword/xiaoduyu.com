import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DocumentMeta from 'react-document-meta'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getUnreadNotice } from '../../reducers/user'

import config from '../../../config'
import weixin from '../../common/weixin'

export class Meta extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { unreadNotice } = this.props

    let meta = {
      title: (unreadNotice > 0 ? '('+unreadNotice+')' : '') + config.name,
      description: config.description
    }
    
    if (this.props.meta) {
      meta = this.props.meta
      meta.title += ' - '+config.name
    }

    if (weixin.in) {
      document.title = meta.title
      var oHead = document.getElementsByTagName('body')[0]
      var oScript= document.createElement("iframe")
      oScript.src = '//qncdn.xiaoduyu.com/64.png'
      // oScript.src = window.location.origin + "/favicon.png"
      oScript.style.display = 'none'
      oScript.onload = ()=> {
        setTimeout(()=>{ oHead.removeChild(oScript)}, 0)
      }
      oHead.appendChild(oScript)
    }

    return (
      <DocumentMeta {...meta} />
    )
  }
}

Meta.propTypes = {
  unreadNotice: PropTypes.number.isRequired
}

const mapStateToProps = (state) => {
  return {
    unreadNotice: getUnreadNotice(state)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Meta)
