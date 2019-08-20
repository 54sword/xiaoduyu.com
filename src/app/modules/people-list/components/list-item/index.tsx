import React from 'react';
import { Link } from 'react-router-dom';

import './styles/index.scss';

import Follow from '@app/components/follow';

export default ({ people }: any)=>{

  return (<div key={people._id} className="list-group-item" styleName="people-item">
    <img styleName="avatar" src={people.avatar_url} />
    <div className="d-flex justify-content-between">
      <div>
        <Link to={`/people/${people._id}`} styleName="link"><b>{people.nickname}</b></Link>
        <div styleName="people-status">
          {people.posts_count ? <span>帖子 {people.posts_count}</span> : null}
          {people.comment_count ? <span>评论 {people.comment_count}</span> : null}
          {people.fans_count ? <span>粉丝 {people.fans_count}</span> : null}
          {people.follow_people_count ? <span>关注用户 {people.follow_people_count}</span> : null}
          {people.follow_posts_count ? <span>关注帖子 {people.follow_posts_count}</span> : null}
          {people.follow_topic_count ? <span>话题 {people.follow_topic_count}</span> : null}
        </div>
      </div>
      <div>
        <Follow user={people} />
      </div>
    </div>
  </div>)

}
