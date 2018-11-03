import React, { Component } from 'react'

import { original_api_domain } from '../../../config'

// redux
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile, getAccessToken } from '../../store/reducers/user'
import { updateUser, loadUserInfo } from '../../store/actions/user'
import { oAuthUnbinding } from '../../store/actions/oauth'

// components
import Shell from '../../components/shell'
import Meta from '../../components/meta'

// styles
import './style.scss'

@Shell
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

  }

  async submit() {

    const { name, binding } = this.state
    const { me, accessToken, oAuthUnbinding, loadUserInfo } = this.props;
    const { oauthName } = this.props.match.params;

    if (binding) {

      if (confirm(`您确认解除 ${name} 的绑定吗？`)) {

        let [ err, res ] = await oAuthUnbinding({
          args: { name: oauthName }
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
        window.location.href = `${original_api_domain}/oauth/${oauthName}?access_token=${accessToken}`;
      }
    }

  }

  render() {

    const { name, binding } = this.state;

    return (
      <div>
        <Meta title={name} />
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
      </div>
    )

  }

}
