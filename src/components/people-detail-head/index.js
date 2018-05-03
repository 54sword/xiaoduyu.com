import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '../../actions/people';
import { getPeopleListByName } from '../../reducers/people';

// components
import Meta from '../meta';
import Follow from '../follow';
import Loading from '../ui/loading';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

// import To from '../../common/to';

@connect(
  (state, props) => ({
    list: getPeopleListByName(state, props.id)
  }),
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
@CSSModules(styles)
export class PeopleDetailHead extends React.Component {

  static propTypes = {
    // 用户id
    id: PropTypes.string.isRequired
  }

  // 服务端渲染
  // 加载需要在服务端渲染的数据

  static loadData({ store, match }) {
    return new Promise(async (resolve, reject) => {

      const { id } = match.params;

      const [ err, data ] = await loadPeopleList({
        name: id,
        filters: {
          variables: {
            _id: id,
            blocked: false
          }
        }
      })(store.dispatch, store.getState);


      // 没有找到帖子，设置页面 http code 为404
      if (err || data.length == 0) {
        resolve({ code: 404 });
      } else {
        resolve({ code: 200 });
      }

    })
  }

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    // 服务端渲染，404内容显示处理
    const { list, notFoundPgae } = this.props;
    if (list && list.data && !list.data[0]) {
      notFoundPgae('该用户不存在')
    }
  }

  async componentDidMount() {

    const { id, loadPeopleList, list, notFoundPgae } = this.props;

    if (!list || !list.data) {

      await loadPeopleList({
        name:id,
        filters: {
          variables: { _id: id, blocked: false }
        }
      });

      this.componentWillMount();

    }

  }

  render() {

    const { id, list, body } = this.props;
    const { loading, data } = list || {};
    const people = data && data[0] ? data[0] : null;

    if (loading || !people) return (<Loading />);

    return (
      <div>
        <Meta title={people.nickname} />

        <div styleName="header">

          <div>
            <img src={people.avatar_url.replace(/thumbnail/, "large")} />
            <div styleName="nickname">{people.nickname}</div>
            <div>{people.brief}</div>
            <div styleName="follow">
              <Follow user={people} />
            </div>
          </div>

          <div styleName="tab">
            <NavLink exact to={`/people/${people._id}`}>
                <span>{people.posts_count > 0 ? people.posts_count : 0}</span>帖子
              </NavLink>
            <NavLink exact to={`/people/${people._id}/follow/posts`}>
                <span>{people.follow_posts_count > 0 ? people.follow_posts_count : 0}</span>关注的帖子
              </NavLink>
            <NavLink exact to={`/people/${people._id}/comments`}>
              <span>{people.comment_count > 0 ? people.comment_count : 0}</span>评论
              </NavLink>
            <NavLink exact to={`/people/${people._id}/follow/topics`}>
              <span>{people.follow_topic_count > 0 ? people.follow_topic_count : 0}</span>话题
              </NavLink>
            <NavLink exact to={`/people/${people._id}/follow/peoples`}>
              <span>{people.follow_people_count > 0 ? people.follow_people_count : 0}</span>关注的人
              </NavLink>
            <NavLink exact to={`/people/${people._id}/fans`}>
              <span>{people.fans_count > 0 ? people.fans_count : 0}</span>粉丝
              </NavLink>
          </div>

        </div>

        <div>
          {body || '空'}
        </div>
      </div>
    )

  }

}

export default PeopleDetailHead;
