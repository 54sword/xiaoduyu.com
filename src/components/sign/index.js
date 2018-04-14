import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// config
import { original_api_url } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { hideSign } from '../../actions/sign';
import { getSignStatus } from '../../reducers/sign';

// components
import SignIn from '../sign-in';
import SignUp from '../sign-up';
import Modal from '../bootstrap/modal';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    display: getSignStatus(state)
  }),
  dispatch => ({
    hideSign: bindActionCreators(hideSign, dispatch)
  })
)
@CSSModules(styles)
export default class Sign extends Component {

  constructor(props) {
    super(props)
    this.state = {
      type: 'sign-in'
    }
    this.displayComponent = this.displayComponent.bind(this)
  }

  displayComponent() {
    this.setState({
      type: this.state.type == 'sign-up' ? 'sign-in' : 'sign-up'
    })
  }

  componentDidMount() {

    const self = this;

    $('#sign').on('show.bs.modal', function (e) {
      self.setState({
        type: e.relatedTarget.getAttribute('data-type') || 'sign-in'
      });
    })

  }

  render () {

    const { display, hideSign } = this.props
    const { type } = this.state

    const body = (<div styleName="layer">

            <div styleName="social">
              <ul>
                <li>
                  <a href={`${original_api_url}/oauth/weibo`} styleName="weibo">
                    <span styleName="weibo-icon">使用微博登录</span>
                  </a>
                </li>
                <li>
                  <a href={`${original_api_url}/oauth/qq`} styleName="qq">
                  <span styleName="qq-icon">使用 QQ 登录</span>
                  </a>
                </li>
                <li>
                  <a href={`${original_api_url}/oauth/github`} styleName="github">
                    <span styleName="github-icon">使用 GitHub 登录</span>
                  </a>
                </li>
              </ul>
            </div>

            <fieldset><legend>或</legend></fieldset>

            {type == 'sign-in' ? <div>
                <SignIn hideSign={hideSign} displayComponent={this.displayComponent} />
                <div>
                  没有账号？ <a href="javascript:void(0)" onClick={this.displayComponent}>注册</a>
                </div>
                <div><Link to="/forgot" onClick={()=>{ $('#sign').modal('hide'); }}>忘记密码？</Link></div>
              </div>
              : null}
            {type == 'sign-up' ? <div>
                <SignUp hideSign={hideSign} displayComponent={this.displayComponent} />
                <div>
                  已经有账号了？ <a href="javascript:void(0)" onClick={this.displayComponent}>登录</a>
                </div>
              </div>
              : null}

            <div>登录即表示你同意网站的《服务条款》</div>
          </div>);

    return (<div>
      <Modal
        id="sign"
        title={type == 'sign-in' ? '登录' : '注册'}
        body={body}
        />
    </div>)
  }
}
