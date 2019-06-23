import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// redux
// import { bindActionCreators } from 'redux';
import { useStore, useSelector } from 'react-redux';
import { findFollows } from '@actions/follow';
import { getFollowListById } from '@reducers/follow';

// components
import Follow from '@components/follow';

// class
import ListClass from '../../class/list';

// styles
import './style.scss';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  // 没有数据的时候显示内容
  nothing?: any;
}

export default function(props:Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getFollowListById(state, id)
  });

  return (<ListClass
    {...props}
    {...list}
    load={params=>findFollows(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{

      let people = item.people_id || item.user_id || null;
      let posts = item.posts_id || null;
      let topic = item.topic_id || null;

      if (people) {
        return (<div key={people._id} className="list-group-item" styleName="people-item">
          <img styleName="avatar" src={people.avatar_url} />
          <div className="d-flex justify-content-between">
            <div>
              <Link to={`/people/${people._id}`} styleName="link"><b>{people.nickname}</b></Link>
              {people.brief ? <div>{people.brief}</div> : null}
              <div styleName="people-status">
                {people.posts_count ? <span>帖子 {people.posts_count}</span> : null}
                {people.comment_count ? <span>评论 {people.comment_count}</span> : null}
                {people.fans_count ? <span>粉丝 {people.fans_count}</span> : null}
                {people.follow_people_count ? <span>关注用户 {people.follow_people_count}</span> : null}
                {people.follow_posts_count ? <span>关注帖子 {people.follow_posts_count}</span> : null}
                {people.follow_topic_count ? <span>话题 {people.follow_topic_count}</span> : null}
              </div>
            </div>
            <div style={{minWidth:'70px',textAlign:'right'}}>
              <Follow user={people} />
            </div>
          </div>
        </div>)
      }

      if (posts) {
        return (<div key={posts._id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <div>
              <Link to={`/posts/${posts._id}`} styleName="link"><b>{posts.title}</b></Link>
            </div>
            <div>
              <Follow posts={posts} />
            </div>
          </div>
        </div>)
      }

      if (topic) {
        return (<div key={topic._id} className="list-group-item">
          <div className="d-flex justify-content-between">
            <div>
              <Link to={`/topic/${topic._id}`} styleName="link"><b>{topic.name}</b></Link>
            </div>
            <div>
              <Follow topic={topic} />
            </div>
          </div>
        </div>)
      }
      
    }}
  />)

}

/*
@connect(
  (state, props) => ({
    list: getFollowListById(state, props.id)
  }),
  dispatch => ({
    load: bindActionCreators(findFollows, dispatch)
  })
)
export default class CommentList extends Component {

  static defaultProps = {
    scrollLoad: true
  }

  static propTypes = {
    // 列表名称
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    args: PropTypes.object.isRequired,

    fields: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    const { id, list, scrollLoad } = this.props
    if (!list.data || list.data.length == 0) this.load();
    if (scrollLoad) ArriveFooter.add(id, this.load);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  load(callback) {
    const { id, args, fields, load } = this.props;
    load({ id, args, fields });
  }

  componentWillReceiveProps(props) {

    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }

  }

  render () {

    const { list } = this.props;
    const { data, loading, more, filters = {}, count } = list;

    return (
      <div styleName="list" className="card">
        {data && data.map((item, index)=>{

          let people = item.people_id || item.user_id || null;
          let posts = item.posts_id || null;
          let topic = item.topic_id || null;

          if (people) {
            return (<div key={people._id} className="list-group-item" styleName="people-item">
              <img styleName="avatar" src={people.avatar_url} />
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/people/${people._id}`} styleName="link"><b>{people.nickname}</b></Link>
                  {people.brief ? <div>{people.brief}</div> : null}
                  <div styleName="people-status">
                    {people.posts_count ? <span>帖子 {people.posts_count}</span> : null}
                    {people.comment_count ? <span>评论 {people.comment_count}</span> : null}
                    {people.fans_count ? <span>粉丝 {people.fans_count}</span> : null}
                    {people.follow_people_count ? <span>关注用户 {people.follow_people_count}</span> : null}
                    {people.follow_posts_count ? <span>关注帖子 {people.follow_posts_count}</span> : null}
                    {people.follow_topic_count ? <span>话题 {people.follow_topic_count}</span> : null}
                  </div>
                </div>
                <div style={{minWidth:'70px',textAlign:'right'}}>
                  <Follow user={people} />
                </div>
              </div>
            </div>)
          }

          if (posts) {
            return (<div key={posts._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/posts/${posts._id}`} styleName="link"><b>{posts.title}</b></Link>
                </div>
                <div>
                  <Follow posts={posts} />
                </div>
              </div>
            </div>)
          }

          if (topic) {
            return (<div key={topic._id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <div>
                  <Link to={`/topic/${topic._id}`} styleName="link"><b>{topic.name}</b></Link>
                </div>
                <div>
                  <Follow topic={topic} />
                </div>
              </div>
            </div>)
          }

      })}
      </div>
    )
  }
}
*/