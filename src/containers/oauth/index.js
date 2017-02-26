import React, { Component, PropTypes } from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addAccessToken } from '../../actions/sign'

import Shell from '../../shell'

class Oauth extends React.PureComponent {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { access_token = '', expires = 0 } = this.props.location.query
    const { addAccessToken } = this.props
    if (access_token) {
      addAccessToken({ access_token, expires })
      window.location.href = '/'
    }
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
