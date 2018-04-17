import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfile } from '../../reducers/user';

// compoments
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import Sidebar from '../../components/sidebar';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@connect(
  (state, props) => ({
    me: getProfile(state)
  }),
  dispatch => ({})
)
@CSSModules(styles)
export class Me extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    const { me } = this.props;

    return (<div>

      <Meta title={me.nickname} />

      <div className="container">
      <div className="row">

        {/* left */}
        <div className="col-md-9">

          <div className="list-group mb-2">
            <div className="list-group-item" styleName="header">
              <Link to="/settings">
                <img src={me.avatar_url.replace('!50', "!100")} />
                <div>{me.nickname}</div>
              </Link>
            </div>
          </div>

          <div className="list-group mb-2">
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/posts`}>
              我创建的帖子
              <span className="badge badge-primary badge-pill">{me.posts_count}</span>
            </Link>
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/comments`}>
              我编写的评论
              <span className="badge badge-primary badge-pill">{me.comment_total}</span>
            </Link>
          </div>

          <div className="list-group mb-2">
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/follow/posts`}>
              <span>我关注的帖子</span>
              <span className="badge badge-primary badge-pill">{me.follow_posts_count}</span>
            </Link>
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/topics`}>
              我关注的话题
              <span className="badge badge-primary badge-pill">{me.follow_node_count}</span>
            </Link>
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/following`}>
              我关注的人
              <span className="badge badge-primary badge-pill">{me.follow_people_count}</span>
            </Link>
            <Link className="list-group-item d-flex justify-content-between align-items-center" to={`/people/${me._id}/fans`}>
              我的粉丝
              <span className="badge badge-primary badge-pill">{me.fans_count}</span>
            </Link>
          </div>

          {me._id && me.role == 100 ?
            <div className="list-group mb-2">
              <Link className="list-group-item" to={`/all-topic`}>管理社群</Link>
              <Link className="list-group-item" to={`/add-topic`}>添加新的社区</Link>
            </div>
          :null}

          <div className="list-group">
            <Link className="list-group-item" to="/settings">设置</Link>
          </div>

        </div>

        {/* right */}
        <div className="col-md-3">
          <Sidebar />
        </div>

      </div>
      </div>
    </div>)

  }

}

export default Shell(Me)
