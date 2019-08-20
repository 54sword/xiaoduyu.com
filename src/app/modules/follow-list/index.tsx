import React from 'react';
import { Link } from 'react-router-dom';

// redux
import { useStore, useSelector } from 'react-redux';
import { findFollows } from '@app/redux/actions/follow';
import { getFollowListById } from '@app/redux/reducers/follow';

// components
import Follow from '@app/components/follow';

// class
import ListClass from '@app/class/list';

// styles
import './styles/index.scss';

interface Props {
  // 列表id
  id: string
  // 查询条件
  query: object
  // 启动滚动加载
  scrollLoad?: boolean
  // 显示分页
  showPagination?: boolean
  // 没有数据的时候显示内容
  nothing?: any
  fields: any
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

      let content = null;
      let key = null;

      if (people) {
        key = people._id;
        content = (<div styleName="people-item">
          <img styleName="avatar" src={people.avatar_url} />
          <div className="d-flex justify-content-between">
            <div>
              <Link to={`/people/${people._id}`} styleName="link"><b>{people.nickname}</b></Link>
              {people.brief ? <div className="text-secondary">{people.brief}</div> : null}
              <div styleName="people-status" className="text-secondary">
                {people.posts_count ? <small>帖子 {people.posts_count}</small> : null}
                {people.comment_count ? <small>评论 {people.comment_count}</small> : null}
                {people.fans_count ? <small>粉丝 {people.fans_count}</small> : null}
                {people.follow_people_count ? <small>关注用户 {people.follow_people_count}</small> : null}
                {people.follow_posts_count ? <small>关注帖子 {people.follow_posts_count}</small> : null}
                {people.follow_topic_count ? <small>话题 {people.follow_topic_count}</small> : null}
              </div>
            </div>
            <div style={{minWidth:'70px',textAlign:'right'}}>
              <Follow user={people} />
            </div>
          </div>
        </div>)
      }

      if (posts) {
        key = posts._id;
        content = (<div>
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
        key = topic._id;
        content = (<div>
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

      return <div className="card mb-0" key={key}>
        <div className="card-body p-0">{content}</div>
        <div style={{ marginLeft: '83px' }} className="border-bottom"></div>
      </div>;
      
    }}
  />)

}