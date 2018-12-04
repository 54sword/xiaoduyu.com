import React, { Component } from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveTokenToCookie } from '../../store/actions/sign';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';

// styles
import './style.scss';

@Shell
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    saveTokenToCookie: bindActionCreators(saveTokenToCookie, dispatch)
  })
)
export default class OAuth extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    const { access_token = '', expires = 0, landing_page = '/' } = this.props.location.params;
    const { saveTokenToCookie } = this.props;
    
    if (access_token) {
      saveTokenToCookie({ access_token }).then((res)=>{
        if (res && res.success) {
          window.location.href = landing_page;
        }
      }).catch(err=>{
        alert('登录失败');
        window.location.href = '/';
      })

      /*
      console.log(landing_page);

      if (res && res.success) {
        window.location.href = landing_page;
      } else {
        alert('登录失败');
        window.location.href = '/';
      }
      */

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
