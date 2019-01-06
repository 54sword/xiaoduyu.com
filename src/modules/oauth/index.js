import React, { Component } from 'react';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveTokenToCookie } from '@actions/sign';

// styles
import './index.scss';

@withRouter
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
      });
    } else {
      window.location.href = '/';
    }

  }

  render() {
    return (<div styleName="container">
      登录跳转中...
    </div>)
  }

}
