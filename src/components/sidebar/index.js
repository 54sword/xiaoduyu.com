import React from 'react';

import { name } from '../../../config';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../actions/posts';
import { isMember, getProfile } from '../../reducers/user';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

// components
import SignIn from '../sign-in';
import PostsList from '../../components/posts/list';

@connect(
  (state, props) => ({
    me: getProfile(state),
    isMember: isMember(state)
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

    const { isMember, me, recommendPostsDom } = this.props

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
          <a href="/new-posts" styleName="new-posts" target="_blank">创建帖子</a>
          {/*<div>快捷发帖，问与答，好奇心</div>*/}
          </div>
        :
        null}

      {/*
      <div className="card">
        <div className="card-header">新人</div>
        <div className="card-body">
        </div>
      </div>
      */}

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

      <div styleName="footer">
        <div>
          <a href="https://github.com/54sword/xiaoduyu.com" target="_blank">源代码</a>
          <a href="mailto:shijian.wu@hotmail.com">联系作者</a>
        </div>
        <p>©{new Date().getFullYear()} {name} (浙ICP备14013796号-3)</p>
      </div>

    </div>)
  }

}
