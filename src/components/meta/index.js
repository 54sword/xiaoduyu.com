import React, { Component, PropTypes } from 'react'
import DocumentMeta from 'react-document-meta'

import config from '../../../config'
import weixin from '../../common/weixin'

class Meta extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    let meta = {
      title: config.name,
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
      oScript.src = 'https://ojkahzhlx.qnssl.com/64.png'
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

export default Meta
