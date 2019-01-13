import React, { Component } from 'react'

import { original_api_domain } from '@config'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile, getAccessToken } from '@reducers/user'
import { loadUserInfo } from '@actions/user'
import { oAuthUnbinding } from '@actions/oauth'

// styles
import './style.scss'

@connect(
  (state, props) => ({
    me: getProfile(state),
    accessToken: getAccessToken(state)
  }),
  dispatch => ({
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch),
    oAuthUnbinding: bindActionCreators(oAuthUnbinding, dispatch)
  })
)
export default class settingsOauth extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: '',
      binding: false
    }
    this.submit = this.submit.bind(this);
  }

  componentDidMount() {

    /*
    const { me, notFoundPgae } = this.props;
    const { oauthName } = this.props.match.params;

    let name = '';

    if (oauthName == 'qq') {
      name = '腾讯QQ'
    } else if (oauthName == 'weibo') {
      name = '微博'
    } else if (oauthName == 'github') {
      name = 'Github'
    } else {
      return notFoundPgae();
    }

    this.setState({
      name,
      binding: me[oauthName]
    });
    */

  }

  async submit(name) {

    const { me, accessToken, oAuthUnbinding, loadUserInfo } = this.props;
    
    if (me[name]) {

      if (confirm(`您确认解除 ${name} 的绑定吗？`)) {

        let [ err, res ] = await oAuthUnbinding({
          args: { name }
        });

        await loadUserInfo({});

        this.componentDidMount();

        Toastify({
          text: '解除成功',
          duration: 3000,
          backgroundColor: 'linear-gradient(to right, #50c64a, #40aa33)'
        }).showToast();

      }

    } else {
      if (confirm(`您确认绑定 ${name} 吗？`)) {
        window.location.href = `${original_api_domain}/oauth/${name}?access_token=${accessToken}`;
      }
    }

  }

  render() {
    
    const { me } = this.props; 

    return (
      <div>
        
        <div className="card">
        <div className="card-header">第三方帐号</div>
          <div className="card-body">
            <div className="container">
            <div className="row">
              <div className="col-4">
                <div>QQ</div>
                <div><a href="javascript:void(0)" onClick={()=>{ this.submit('qq'); }}>{me.qq ? '已绑定' : '未绑定' }</a></div>
              </div>
              <div className="col-4">
                <div>微博</div>
                <div><a href="javascript:void(0)" onClick={()=>{ this.submit('weibo'); }}>{me.weibo ? '已绑定' : '未绑定' }</a></div>
              </div>
              <div className="col-4">
                <div>GitHub</div>
                <div><a href="javascript:void(0)" onClick={()=>{ this.submit('github'); }}>{me.github ? '已绑定' : '未绑定' }</a></div>
              </div>
            </div>
            </div>
          </div>
        </div>

        {/* 
        <div className="card">
          <div className="card-header">{name}</div>
          <div className="card-body" style={{padding:'20px'}}>

            {binding ?
              <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit} styleName="hover">
                <span>已绑定 {name}</span>
                <span>取消绑定 {name}</span>
              </a>
              :
              <a className="btn btn-primary" href="javascript:void(0);" onClick={this.submit} styleName="hover">
                <span>未绑定 {name}</span>
                <span>立即绑定 {name}</span>
              </a>}

          </div>
        </div>
        */}
      </div>
    )

  }

}
