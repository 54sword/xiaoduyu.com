import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { signout } from '../../actions/sign'
import { getUserInfo } from '../../reducers/user'

import { resetNickname, loadUserInfo } from '../../actions/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
import Subnav from '../../components/subnav'

class ResetNickname extends Component {

  constructor(props) {
    super(props)
    this.submitResetPassword = this.submitResetPassword.bind(this)
  }

  componentDidMount() {
    const { nickname } = this.refs
    nickname.focus()
  }

  submitResetPassword() {

    const self = this
    const { resetNickname, loadUserInfo } = this.props
    const { nickname } = this.refs

    if (!nickname.value) {
      nickname.focus()
      return
    }

    resetNickname({
      nickname: nickname.value,
      callback: function(res){
        if (!res.success) {
          alert(res.error)
        } else {
          alert('昵称修改成功')
          loadUserInfo({})
          self.context.router.goBack()
        }
      }
    })

  }

  render() {

    const { user } = this.props

    return (
      <div>
        <Meta meta={{title:'修改名字'}} />
        <Subnav
          middle="修改名字"
        />
        <div className="container">

          <div className="list">
            <input type="text" defaultValue={user.nickname} ref="nickname"></input>
          </div>

          <div className="list">
            <a className="center" href="javascript:void(0);" onClick={this.submitResetPassword}>确认修改</a>
          </div>

        </div>
      </div>
    )

  }

}

ResetNickname.contextTypes = {
  router: PropTypes.object.isRequired
}

ResetNickname.propTypes = {
  user: PropTypes.object.isRequired,
  resetNickname: PropTypes.func.isRequired,
  loadUserInfo: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    user: getUserInfo(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resetNickname: bindActionCreators(resetNickname, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  }
}

ResetNickname = connect(mapStateToProps, mapDispatchToProps)(ResetNickname)

export default Shell(ResetNickname)
