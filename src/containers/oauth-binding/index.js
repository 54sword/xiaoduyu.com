import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadUserInfo } from '../../actions/user'
import { getProfile } from '../../reducers/user'

import { unbindingQQ, unbindingWeibo } from '../../actions/oauth'
import { getAccessToken } from '../../reducers/user'

import Shell from '../../shell'
import Meta from '../../components/meta'
// import Nav from '../../components/nav'
import Subnav from '../../components/subnav'

import { api_url } from '../../../config'

class OauthBinding extends Component {

  constructor(props) {
    super(props)
    this.binding = this.binding.bind(this)
    this.unbinding = this.unbinding.bind(this)
  }

  binding() {
    const { accessToken } = this.props
    const { source } = this.props.params

    if (source == 'qq' && confirm('您确认绑定 QQ 吗？')) {
      window.location.href = api_url+'/oauth/qq?access_token='+accessToken;
    } else if (source == 'weibo' && confirm('您确认绑定 微博 吗？')) {
      window.location.href = api_url+'/oauth/weibo?access_token='+accessToken;
    }
  }

  unbinding() {
    const { unbindingQQ, unbindingWeibo, loadUserInfo, accessToken } = this.props
    const { source } = this.props.params
    const self = this

    if (source == 'qq' && confirm('您确认解除 QQ 绑定吗？')) {
      unbindingQQ({
        callback: function(err, result){
          loadUserInfo(accessToken)
          alert('解除绑定成功')
          self.context.router.goBack()
        }
      })
    } else if (source == 'weibo' && confirm('您确认解除 微博 绑定吗？')) {
      unbindingWeibo({
        callback: function(err, result){
          loadUserInfo(accessToken)
          alert('解除绑定成功')
          self.context.router.goBack()
        }
      })
    }
  }

  render() {
    
    const { me, displayNotFoundPage } = this.props
    const { source } = this.props.params

    const title = source == 'qq' ? '绑定QQ' : '绑定微博'

    if (source == 'qq' || source == 'weibo') {

      return (
        <div>
          <Meta meta={{title:title}} />
          <Subnav middle={title} />
          <div className="container">
            <div className="list">
              {me[source] ?
                <a href="javascript:void(0)" onClick={this.unbinding}>解除绑定</a>
                :
                <a href="javascript:void(0)" onClick={this.binding}>提交绑定</a>
              }
            </div>
          </div>
        </div>
      )

    } else {
      displayNotFoundPage()
    }

  }

}

OauthBinding.contextTypes = {
  router: PropTypes.object.isRequired
}

OauthBinding.propTypes = {
  me: PropTypes.object.isRequired,
  accessToken: PropTypes.string.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
  unbindingQQ: PropTypes.func.isRequired,
  unbindingWeibo: PropTypes.func.isRequired
}

function mapStateToProps(state) {
  return {
    me: getProfile(state),
    accessToken: getAccessToken(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    unbindingQQ: bindActionCreators(unbindingQQ, dispatch),
    unbindingWeibo: bindActionCreators(unbindingWeibo, dispatch)
  }
}

OauthBinding = connect(mapStateToProps, mapDispatchToProps)(OauthBinding)


export default Shell(OauthBinding)
