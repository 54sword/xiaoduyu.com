import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '../../actions/people';
import { getPeopleListByName } from '../../reducers/people';

// components
import Shell from '../shell';
import Meta from '../meta';
import Follow from '../follow';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

function renderChildren(props) {
  const [ people ] = props.peoples
  return React.Children.map(props.children, child => {
    return React.cloneElement(child, {
      people: people
    })
  })
}

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
        resolve({ code:404 });
      } else {
        resolve({ code:200 });
      }

    })
  }

  constructor(props) {
    super(props)
    this.state = {
      currentTab: 0
    }
    this.setCurrentTab = this.setCurrentTab.bind(this)
  }

  componentDidMount() {

    const { id, loadPeopleList, list } = this.props;

    if (!list || !list.data) {

      loadPeopleList({
        name:id,
        filters: {
          variables: { _id: id, blocked: false }
        }
      })
    }
  }

  setCurrentTab(index) {
    this.setState({
      currentTab: index
    })
  }

  render() {

    let { currentTab } = this.state
    const { id, list, body } = this.props
    const { loading, data } = list || {};
    const people = data && data[0] ? data[0] : null;

    // const [ people ] = this.props.peoples
    const { setCurrentTab } = this;

    // let { go } = this.props.location.query
    let go = 1;


    // 404 处理
    if (data && data.length == 0) {
      return '404 Not Found';
    }

    if (loading || !people) return (<div>loading...</div>);

    const tabName = null

    if (!go) {
      go = -1
    } else {
      go -= 1
    }

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
          {/*renderChildren(this.props)*/}
        </div>
      </div>
    )

  }

}

export default PeopleDetailHead;
