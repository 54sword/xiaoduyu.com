import React, { Component } from 'react'
import CSSModules from 'react-css-modules'

import { saveSignInCookie } from '../../actions/sign'
import styles from './style.scss'
import Shell from '../../shell'

class OAuth extends Component {

  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    const { access_token = '', expires = 0, landing_page = '/' } = this.props.location.query
    const { addAccessToken } = this.props

    if (access_token) {
      saveSignInCookie({
        access_token,
        callback: (res)=>{
          if (res.success) {
            window.location.href = landing_page
          } else {
            alert('登录失败')
            window.location.href = '/'
          }
        }
      })
    }
  }

  render() {
    return (<div styleName="container">登录跳转中...</div>)
  }

}

OAuth = CSSModules(OAuth, styles)

export default Shell(OAuth)
