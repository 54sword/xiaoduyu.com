import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cookie from 'react-cookie'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addAccessToken } from '../../actions/sign'
import { auth_cookie_name } from '../../../config'

import Shell from '../../shell'

class Oauth extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { access_token = '', expires = 0 } = this.props.location.query
    const { addAccessToken } = this.props

    // console.log(access_token);
    // console.log(expires);

    if (access_token) {
      addAccessToken({ access_token, expires })

      let option = { path: '/' }

      if (expires) {
        option.expires = new Date(expires)
        cookie.save('expires', expires, option)
      }

      cookie.save(auth_cookie_name, access_token, option)

    }

    window.location.href = '/'
  }

  render() {
    return (<div>跳转中...</div>)
  }

}

Oauth.propTypes = {
  addAccessToken: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return {
    addAccessToken: bindActionCreators(addAccessToken, dispatch)
  }
}

Oauth = connect(mapStateToProps, mapDispatchToProps)(Oauth)

export default Shell(Oauth)
