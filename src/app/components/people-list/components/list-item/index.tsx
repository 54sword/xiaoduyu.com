import React from 'react';
import { Link } from 'react-router-dom';

import './styles/index.scss';

import Follow from '@app/components/follow/button';

interface Props {
  people: {
    _id: string
    avatar_url: string
    nickname: string
    brief: string
    _create_at: string
    posts_count: number
    comment_count: number
    fans_count: number
    follow_people_count: number
    follow: boolean
  }
}

export default ({ people }: Props)=>{

  return (<div key={people._id} className="card-body border-top">
    <div styleName="people-item">
    <img styleName="avatar" src={people.avatar_url} />
    <div className="row">
      <div className="col-sm-12 col-md-8">
        <Link to={`/people/${people._id}`} className="text-dark">{people.nickname}</Link>
        {people.brief ? <div className="text-secondary">{people.brief}</div> : null}
        <div className="text-muted"><small>注册于 {people._create_at}</small></div>
        <div styleName="people-status" className="text-muted">
          {people.posts_count ? <small>帖子 {people.posts_count}</small> : null}
          {people.comment_count ? <small>评论 {people.comment_count}</small> : null}
          {people.fans_count ? <small>粉丝 {people.fans_count}</small> : null}
          {people.follow_people_count ? <small>关注用户 {people.follow_people_count}</small> : null}
        </div>
      </div>
      <div className="col-sm-12 col-md-4 text-right">
        <Follow user={people} />
      </div>
    </div>
    </div>
  </div>)

}
