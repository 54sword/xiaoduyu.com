import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

// components
import CommentList from '@modules/comment-list';
import FollowList from '@modules/follow-list';
import PostsList from '@modules/posts-list';
import FeedList from '@modules/feed-list';

// styles
// import './index.scss';

@withRouter
export default class PeopleActivites extends React.Component {

  static propTypes = {
    people: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      posts_count: PropTypes.number.isRequired,
      fans_count: PropTypes.number.isRequired,
      follow_people_count: PropTypes.number.isRequired,
      follow_posts_count: PropTypes.number.isRequired,
      follow_topic_count: PropTypes.number.isRequired
    })
  }

  constructor(props) {
    super(props);

    const id = this.props.people._id;

    this.state = {
      isMount: false,
      typeList: {

        '/': (<FeedList
          id={id}
          filters={{
            variables: {
              user_id: id,
              // method: 'user_follow',
              sort_by: "create_at:-1"
              // deleted: false,
              // weaken: false
            }
          }}
          scrollLoad={true}
        />),

        '/comments': (<CommentList
          name={id}
          filters={{
            variables: {
              user_id: id,
              sort_by: "create_at",
              parent_id: 'not-exists',
              deleted: false,
              weaken: false
            }
          }}
          scrollLoad={true}
        />),
        '/fans': (<FollowList
          id={'fans-'+id}
          args={{
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
        />),
        "/follow-peoples": (<FollowList
          id={'people-'+id}
          args={{
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
        />),
        "/follow-topics": (<FollowList
          id={'topic-'+id}
          args={{
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
        />),
        "/follow-posts": (<FollowList
          id={'posts-'+id}
          args={{
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
        />),
        "/posts": (<PostsList
          id={id}
          filters={{
            variables: {
              user_id: id,
              sort_by: "create_at",
              deleted: false
            }
          }}
          scrollLoad={true}
        />)
      }
    }
  }
  
  componentDidMount() {
    this.setState({ isMount: true });
  }

  render() {

    const { typeList, isMount } = this.state;
    const { people } = this.props;
    if (!isMount) return null;

    let pathname = this.props.location.pathname;

    pathname = pathname.replace('/people/'+people._id, '');

    if (!pathname) pathname = '/';
    
    return (<>

      <div className="nav nav-tabs nav-justified mb-2 rounded-bottom">

        <NavLink className="nav-link" exact to={`/people/${people._id}`}>
          动态
        </NavLink>

        <NavLink className="nav-link" exact to={`/people/${people._id}/posts`}>
          帖子 {people.posts_count || ''}
        </NavLink>

        <NavLink className="nav-link" exact to={`/people/${people._id}/fans`}>
          粉丝 {people.fans_count || ''}
        </NavLink>
        
        <NavLink className="nav-link" exact to={`/people/${people._id}/follow-peoples`}>
          关注的人 {people.follow_people_count || ''}
        </NavLink>
        
        <NavLink className="nav-link" exact to={`/people/${people._id}/follow-posts`}>
          关注的帖子 {people.follow_posts_count || ''}
        </NavLink>
        
        <NavLink className="nav-link" exact to={`/people/${people._id}/follow-topics`}>
          关注的话题 {people.follow_topic_count || ''}
        </NavLink>

      </div>

      {typeList[pathname] || null}

    </>)
  }

}