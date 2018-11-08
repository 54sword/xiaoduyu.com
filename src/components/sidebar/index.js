import React from 'react';

import { name } from '../../../config';

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
    recommendPostsDom: ''
  }

  constructor(props) {
    super(props);
  }

  render() {

    const { isMember, me, recommendPostsDom, onlineCount } = this.props

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
                    </div>
                    {/*
                    <div>
                      {onlineCount} 人在线
                    </div>
                    */}
                    
                    2017-{new Date().getFullYear()} {name}<br />
                    <a href="http://www.miitbeian.gov.cn" target="_blank">浙ICP备14013796号-3</a>
                  </div>);

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
          <div className="card-body" styleName="slogan">
            <h1>小度鱼是什么社区？</h1>
            <h2>自然生长的讨论型社区</h2>
            <div><a href="#">建议</a> <a href="#">反馈</a></div>
            {/*<h2>可能是技术人交流的地方</h2>*/}
            <div>
              <a href="#" className="btn btn-primary">加入社区</a>
            </div>
            <div>下载小度鱼APP</div>
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

      <div className="card">
        <div className="card-header">小度鱼社区相关开源</div>
        <div className="card-body">
          <div><a href="https://github.com/54sword/xiaoduyu.com" target="_blank">前端（React）</a></div>
          <div><a href="https://github.com/54sword/api.xiaoduyu.com" target="_blank">后端（NodeJS+Express+MongoDB）</a></div>
          <div><a href="https://github.com/54sword/xiaoduyuReactNative" target="_blank">移动端（React Native）</a></div>
          <div><a href="https://github.com/54sword/admin.xiaoduyu.com" target="_blank">后台管理（React）</a></div>
          <div><a href="https://github.com/54sword/react-starter" target="_blank">React同构脚手架</a></div>
        </div>
      </div>
      
      {footer}
        
    </div>)
  }

}
