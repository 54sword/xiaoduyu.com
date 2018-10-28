import React from 'react';

import { name } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../store/actions/posts';
import { isMember, getProfile } from '../../store/reducers/user';
import { getOnlineUserCount } from '../../store/reducers/website';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

// components
// import SignIn from '../sign-in';
import PostsList from '../../components/posts/list';

@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state),
    onlineCOunt: getOnlineUserCount(state)
  }),
  dispatch => ({
  })
)
@CSSModules(styles)
export default class Sidebar extends React.Component {

  static defaultProps = {
    // 推荐帖子html
    recommendPostsDom: ''
  }

  constructor(props) {
    super(props);
  }

  render() {

    const { isMember, me, recommendPostsDom, onlineCOunt } = this.props

    /*
    <div className="card">
      <div className="card-body">
        <Link to="/me">
          <img src={me.avatar_url} styleName="avatar" />{me.nickname}
        </Link>
      </div>
    </div>
    */

    return(<div>

      {/*!isMember ?
        <div className="card">
          <div className="card-body"><SignIn /></div>
        </div> :
        null*/}

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
        <div className="card-header">小度鱼开源</div>
        <div className="card-body">
          <div>Web前端</div>
          <div>API后台</div>
          <div>iOS、Android（React Native）移动端</div>
          <div>后台管理</div>
          <div>React同构脚手架</div>
        </div>
      </div>

      <div styleName="footer">
        <div>
          <a href="https://github.com/54sword/xiaoduyu.com" target="_blank">源代码</a>
          <a href="mailto:shijian.wu@hotmail.com">联系作者</a>
        </div>
        {/*
        <div>
          {onlineCOunt} 人在线
        </div>
        */}
        <p>©{new Date().getFullYear()} {name} (浙ICP备14013796号-3)</p>
      </div>

    </div>)
  }

}
