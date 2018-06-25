import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveSignInCookie } from '../../actions/sign';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
  }),
  dispatch => ({
    saveSignInCookie: bindActionCreators(saveSignInCookie, dispatch)
  })
)
@CSSModules(styles)
class OAuth extends Component {

  constructor(props) {
    super(props)
  }

  async componentDidMount() {

    const { access_token = '', expires = 0, landing_page = '/' } = this.props.location.params;
    const { saveSignInCookie } = this.props;
    
    if (access_token) {
      let [ err, res ] = await saveSignInCookie({ access_token });

      if (res && res.success) {
        window.location.href = landing_page;
      } else {
        alert('登录失败');
        window.location.href = '/';
      }

    } else {
      window.location.href = '/';
    }

  }

  render() {
    return (<div styleName="container">
      <Meta title="登陆中..." />
      登录跳转中...
    </div>)
  }

}

export default Shell(OAuth)
