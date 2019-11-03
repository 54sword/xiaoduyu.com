import React from 'react';
import { NavLink } from 'react-router-dom';
import useReactRouter from 'use-react-router';

// components
import FollowList from '@app/components/follow-list';
import NewPostsList from '@app/components/posts-list';
import CommentList from '@app/components/comment-list';

import './styles/index.scss';

interface Props {
  people: {
    _id: string
    posts_count: number
    fans_count: number
    follow_people_count: number
    follow_posts_count: number,
    follow_topic_count: number,
    comment_count: number
  }
}

export default ({ people }: Props)=>{

  const { history, location, match } = useReactRouter();
  const id = people._id;

  const typeList: any = {
    '/comments': (<CommentList
      id={id+'-people'}
      itemType="text"
      query={{
          user_id: id,
          sort_by: "create_at",
          parent_id: 'not-exists',
          deleted: false,
          weaken: false
      }}
      fields={`
        content_html
        create_at
        reply_count
        like_count
        _id
        posts_id{
          _id
          title
        }
      `}
      showPagination={true}
    />),
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
    "/": (<NewPostsList
      id={id}
      query={{
        user_id: id,
        sort_by: "create_at",
        deleted: false
      }}
      // itemType="text"
      fields={`
      _id
      comment_count
      reply_count
      create_at
      follow_count
      like_count
      title
      topic_id{
        _id
        name
      }
      view_count
      `}
      scrollLoad={true}
    />)
  }

  let pathname = location.pathname;

  pathname = pathname.replace('/people/'+people._id, '');

  if (!pathname) pathname = '/';

  // nav nav-tabs nav-justified justify-content-center

  return (<>

    <div className="card mb-0 border-top-0  border-bottom-0 rounded-0">
    <div className="card-body p-0 pt-2 pb-2">
    
    <ul className="nav justify-content-center">

      {/* <NavLink className="nav-link" exact to={`/people/${people._id}`}>
        动态
      </NavLink> */}

      <li className="nav-item">
        <NavLink className="nav-link text-dark" exact to={`/people/${people._id}`}>
          帖子 {people.posts_count || ''}
        </NavLink>
      </li>

      <li className="nav-item">
      <NavLink className="nav-link text-dark" exact to={`/people/${people._id}/comments`}>
        评论 {people.comment_count || ''}
      </NavLink>
      </li>

      <li className="nav-item">
      <NavLink className="nav-link text-dark" exact to={`/people/${people._id}/fans`}>
        粉丝 {people.fans_count || ''}
      </NavLink>
      </li>
      
      <li className="nav-item">
      <NavLink className="nav-link text-dark" exact to={`/people/${people._id}/follow-peoples`}>
        关注 {people.follow_people_count || ''}
      </NavLink>
      </li>
      
      <li className="nav-item">
      <NavLink className="nav-link text-dark" exact to={`/people/${people._id}/follow-posts`}>
        收藏 {people.follow_posts_count || ''}
      </NavLink>
      </li>
      
      <li className="nav-item">
      <NavLink className="nav-link text-dark" exact to={`/people/${people._id}/follow-topics`}>
        话题 {people.follow_topic_count || ''}
      </NavLink>
      </li>

    </ul>

    </div>
    </div>

    <div className="card border-top" styleName="box">
      {typeList[pathname] || null}
    </div>

  </>)
}