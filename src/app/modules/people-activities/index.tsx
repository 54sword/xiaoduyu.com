import React from 'react';
import { NavLink } from 'react-router-dom';
import useReactRouter from 'use-react-router';

// components
import FollowList from '@app/modules/follow-list';
import NewPostsList from '@app/modules/posts-list';
import FeedList from '@app/modules/feed-list';

import './styles/index.scss';

interface Props {
  people: {
    _id: string
    posts_count: number
    fans_count: number
    follow_people_count: number
    follow_posts_count: number,
    follow_topic_count: number
  }
}

export default ({ people }: Props)=>{

  const { history, location, match } = useReactRouter();
  const id = people._id;

  const typeList: any = {
    '/': (<FeedList
      id={id}
      query={{
          user_id: id,
          // method: 'user_follow',
          sort_by: "create_at:-1"
          // deleted: false,
          // weaken: false
      }}
      scrollLoad={true}
    />),

    // '/comments': (<div className="card"><CommentList
    //   name={id}
    //   query={{
    //       user_id: id,
    //       sort_by: "create_at",
    //       parent_id: 'not-exists',
    //       deleted: false,
    //       weaken: false
    //   }}
    //   scrollLoad={true}
    //   showPagination={true}
    // /></div>),
    '/fans': (<FollowList
      id={'fans-'+id}
      query={{
        people_id: id,
        sort_by: 'create_at',
        deleted: false
      }}
      fields={`
        user_id {
          _id
          nickname
          create_at
          fans_count
          comment_count
          follow_people_count
          follow
          avatar_url
          brief
        }
      `}
      scrollLoad={true}
    />),
    "/follow-peoples": (<FollowList
      id={'people-'+id}
      query={{
        user_id: id,
        people_id: 'exists',
        sort_by: 'create_at',
        deleted: false
      }}
      fields={`
        people_id {
          _id
          nickname
          create_at
          fans_count
          comment_count
          follow_people_count
          follow
          avatar_url
          brief
        }
      `}
      scrollLoad={true}
    />),
    "/follow-topics": (<FollowList
      id={'topic-'+id}
      query={{
        user_id: id,
        topic_id: 'exists',
        sort_by: 'create_at',
        deleted: false
      }}
      fields={`
        topic_id {
          _id
          avatar
          name
          follow
        }
      `}
      scrollLoad={true}
    />),
    "/follow-posts": (<FollowList
      id={'posts-'+id}
      query={{
        user_id: id,
        posts_id: 'exists',
        sort_by: 'create_at',
        deleted: false
      }}
      fields={`
        posts_id {
          _id
          title
          follow
        }
      `}
      scrollLoad={true}
    />),
    "/posts": (<NewPostsList
      id={id}
      query={{
        user_id: id,
        sort_by: "create_at",
        deleted: false
      }}
      scrollLoad={true}
    />)
  }


  let pathname = location.pathname;

  pathname = pathname.replace('/people/'+people._id, '');

  if (!pathname) pathname = '/';

  return (<>

    {/* 
    <div className="nav nav-tabs nav-justified border-bottom justify-content-center">

      <NavLink className="nav-link" exact to={`/people/${people._id}`}>
        动态
      </NavLink>

      <NavLink className="nav-link" exact to={`/people/${people._id}/posts`}>
        帖子 {people.posts_count || ''}
      </NavLink>

      <NavLink className="nav-link" exact to={`/people/${people._id}/comments`}>
        评论 {people.comment_count || ''}
      </NavLink>

      <NavLink className="nav-link" exact to={`/people/${people._id}/fans`}>
        粉丝 {people.fans_count || ''}
      </NavLink>
      
      <NavLink className="nav-link" exact to={`/people/${people._id}/follow-peoples`}>
        关注 {people.follow_people_count || ''}
      </NavLink>
      
      <NavLink className="nav-link" exact to={`/people/${people._id}/follow-posts`}>
        收藏 {people.follow_posts_count || ''}
      </NavLink>
      
      <NavLink className="nav-link" exact to={`/people/${people._id}/follow-topics`}>
        话题 {people.follow_topic_count || ''}
      </NavLink>

    </div>
    */}

    <div className="card border-top" styleName="box">
      {typeList[pathname] || null}
    </div>

  </>)
}