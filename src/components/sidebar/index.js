import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode.react';
// import AdSense from 'react-adsense';

import { name, domain_name, Goole_AdSense, client_download_url } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { loadPostsList } from '../../store/actions/posts';
import { isMember, getProfile } from '../../store/reducers/user';
import { getOnlineUserCount } from '../../store/reducers/website';

// style
import './style.scss';

// components
// import PostsList from '../../components/posts/list';
import AdsByGoogle from '../../components/adsbygoogle';

@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    onlineCount: getOnlineUserCount(state)
  }),
  dispatch => ({
  })
)
export default class Sidebar extends React.Component {

  static defaultProps = {
    // 推荐帖子html
    recommendPostsDom: '',
    showFooter: true
  }

  constructor(props) {
    super(props);
    this.state = {
      appsUrl: '',
      loadCompleted: false
    }
  }

  componentDidMount() {

    this.setState({
      loadCompleted: true,
      appsUrl: window.location.origin+'/apps'
    })

  }

  render() {

    const { isMember, me, recommendPostsDom, onlineCount, showFooter } = this.props
    const { appsUrl, loadCompleted } = this.state;

    /*
    <div className="card">
      <div className="card-body">
        <Link to="/me">
          <img src={me.avatar_url} styleName="avatar" />{me.nickname}
        </Link>
      </div>
    </div>

    */

    let footer = (<div styleName="footer">
                    <div>
                      <a href="mailto:shijian.wu@hotmail.com">联系作者</a>
                      {isMember ?
                        <Link to="/new-posts?topic_id=58b7f69ee2c9ef85541619d5">建议与反馈</Link> :
                        <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in">建议与反馈</a>}
                    </div>
                    {/*
                    <div>
                      {onlineCount} 人在线
                    </div>
                    */}
                    
                    2017-{new Date().getFullYear()} {name}<br />
                    <a href="http://www.miitbeian.gov.cn" target="_blank">浙ICP备14013796号-3</a>
                  </div>);
    if (!showFooter) footer = null;

    if (this.props.children) {
      return (<div>
        {this.props.children}
        <br />
        {footer}
      </div>);
    }

    return(<div>

      {isMember ?
          <div>
          <a href="/new-posts" styleName="new-posts" target="_blank" className="d-none d-md-block d-lg-block d-xl-block">创建帖子</a>
          {/*<div>快捷发帖，问与答，好奇心</div>*/}
          </div>
        :
        null}

      {!isMember ?
        <div className="card">
          <div className="card-body" styleName="slogan" style={{borderRadius:'12px'}}>
            <h1>{name}是什么社区？</h1>
            <h2>自然生长的社区</h2>
            {/*<div><a href="#">建议</a> <a href="#">反馈</a></div>*/}
            {/*<h2>可能是技术人交流的地方</h2>*/}
            <div>
              <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-in" className="btn btn-primary btn-sm">加入社区</a>
            </div>
            {/* <div>下载小度鱼APP</div> */}
          </div>
        </div>
        : null}
        
      {Goole_AdSense.sidebar ?
        <div className="card">
          <div className="card-body text-center" style={{borderRadius:'12px'}}>
            <div style={{margin:"5px auto 0 auto"}}><AdsByGoogle {...Goole_AdSense.sidebar} /></div>
          </div>
        </div>
        : null}

      {recommendPostsDom ?
        <div className="card">
          <div className="card-header">最热讨论</div>
          <div className="card-body">
            <div styleName="recommend">
              {recommendPostsDom}
            </div>
          </div>
        </div>
        : null}
      
      {client_download_url ?
        <div className="card">
          <div className="card-header">APP下载</div>
          <div className="card-body">
            
            <div className="text-center">
              {appsUrl ? <QRCode value={appsUrl} />: null}
              <div className="mt-1" style={{color:'#888'}}>iOS / Android 扫码直接下载</div>
            </div>

          </div>
        </div>
        : null}
        
      <div className="card">
        <div className="card-header">小度鱼社区相关开源</div>
        <div className="card-body">
          <div><a href="https://github.com/54sword/xiaoduyu.com" target="_blank">前端（React）</a></div>
          <div><a href="https://github.com/54sword/api.xiaoduyu.com" target="_blank">后端（NodeJS+Express+MongoDB）</a></div>
          <div><a href="https://www.xiaoduyu.com/graphql" target="_blank">Playground(API文档+调试环境)</a></div>
          <div><a href="https://github.com/54sword/xiaoduyuReactNative" target="_blank">移动端（React Native）</a></div>
          <div><a href="https://github.com/54sword/admin.xiaoduyu.com" target="_blank">后台管理（React）</a></div>
          <div><a href="https://github.com/54sword/react-starter" target="_blank">React同构脚手架</a></div>
        </div>
      </div>
      
      {footer}
        
    </div>)
  }

}
