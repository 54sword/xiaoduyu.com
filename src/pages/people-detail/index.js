import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '../../store/actions/people';
import { getPeopleListByName } from '../../store/reducers/people';

// components
import Meta from '../../components/meta';
import Box from '../../components/box';
import Follow from '../../components/follow';
import Loading from '../../components/ui/loading';
import ReportMenu from '../../components/report-menu';
import Sidebar from '../../components/sidebar';
import CommentList from '../../components/comment/list';
import FollowList from '../../components/follow-list';
import PostsList from '../../components/posts/list';
import FeedList from '../../components/feed/list';

// styles
import './index.scss';

// import To from '../../common/to';

/*
class StringToColor {

  static intToRGB(i){
    let c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  static convertStringToColor(str) {
    let hashCode = (str) => { // java String#hashCode
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
    };

    return StringToColor.intToRGB(hashCode(str));
  }

}
*/

@connect(
  (state, props) => {
    const { id } = props.match.params;
    return {
      list: getPeopleListByName(state, id)
    }
  },
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleDetailHead extends React.Component {

  constructor(props) {
    super(props);

    const { id } = this.props.match.params;

    this.state = {
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
        "/follow/peoples": (<FollowList
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
        "/follow/topics": (<FollowList
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
        "/follow/posts": (<FollowList
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

  async componentDidMount() {
    
    const { id } = this.props.match.params;
    let { loadPeopleList, list, notFoundPgae } = this.props;
    let err;

    if (!list || !list.data) {

      [ err, list ] = await loadPeopleList({
        name:id,
        filters: {
          variables: { _id: id, blocked: false }
        }
      });

    }
    
    if (list && list.data && !list.data[0]) {
      notFoundPgae('该用户不存在');
    }

  }

  render() {

    const { typeList } = this.state;
    const { loading, data } = this.props.list || {};
    const people = data && data[0] ? data[0] : null;

    if (loading || !people) return (<Loading />);

    let pathname = this.props.location.pathname;

    pathname = pathname.replace('/people/'+people._id, '');

    if (!pathname) pathname = '/';
    
    return (<Box>
      <div>
        <Meta title={people.nickname} />

        <div styleName="header">

          <div styleName="profile">
            <div styleName="actions">
              <Follow user={people} />
              <ReportMenu user={people} />
            </div>
            <img styleName="avatar" src={people.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')} />
            <div styleName="nickname">
              {people.nickname}
              {/* styleName={people.gender == 1 ? 'male' : 'female'} */}
            </div>
            {Reflect.has(people, 'gender') && people.gender != null ?
                <div>性别：{people.gender == 1 ? '男' : '女'}</div>
                : null}
            <div>{people.brief}</div>
          </div>

        </div>

        <div>{typeList[pathname]}</div>

      </div>
      
      <Sidebar>
        <div className="list-group">
          
          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}`}>
            动态
          </NavLink>
      
          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}/posts`}>
            帖子 {people.posts_count > 0 ? <span class="badge badge-primary badge-pill">{people.posts_count}</span> : 0}
          </NavLink>

          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}/fans`}>
            粉丝 {people.fans_count > 0 ? <span class="badge badge-primary badge-pill">{people.fans_count}</span> : 0}
          </NavLink>

          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}/follow/peoples`}>
            关注的人{people.follow_people_count > 0 ? <span class="badge badge-primary badge-pill">{people.follow_people_count}</span> : 0}
          </NavLink>
          
          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}/follow/posts`}>
            关注的帖子{people.follow_posts_count > 0 ? <span class="badge badge-primary badge-pill">{people.follow_posts_count}</span> : 0}
          </NavLink>
          
          <NavLink className="list-group-item d-flex justify-content-between align-items-center" exact to={`/people/${people._id}/follow/topics`}>
            关注的话题 {people.follow_topic_count > 0 ? <span class="badge badge-primary badge-pill">{people.follow_topic_count}</span> : 0}
          </NavLink>

        </div>
      </Sidebar>
      
    </Box>)

  }

}