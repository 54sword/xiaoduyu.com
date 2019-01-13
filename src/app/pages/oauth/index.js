import React from 'react';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { saveTokenToCookie } from '@actions/sign';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';


@Shell
@connect(
  (state, props) => ({
  }),
  dispatch => ({
    saveTokenToCookie: bindActionCreators(saveTokenToCookie, dispatch)
  })
)
export default class OAuthPage extends React.Component {

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
    return (<>
      <Meta title="登陆中..." />
      <div style={{textAlign:'center', padding:'30px'}}>
        登录跳转中...
      </div>
    </>)
  }

}
