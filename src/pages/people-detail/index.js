import React from 'react';
// import PropTypes from 'prop-types';
// import { Link, NavLink } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '@actions/people';
import { getPeopleListByName } from '@reducers/people';

// components
import Shell from '@components/shell';
// import Meta from '@components/meta';
// import Box from '../../components/box';
// import Follow from '@components/follow';
// import Loading from '@components/ui/full-loading';
// import ReportMenu from '@components/report-menu';
// import Sidebar from '../../components/sidebar';
// import CommentList from '@components/comment/list';
// import FollowList from '@components/follow-list';
// import PostsList from '@modules/posts-list';
// import FeedList from '@modules/feed-list';

import PeopleActivities from '@modules/people-activities';
import PeopleProfileHeader from '@modules/people-profile-header';

import SingleColumns from '../../layout/single-columns';

// styles
// import './index.scss';


@Shell
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

    let { data = [], loading } = this.props.list || {};

    if (loading) return <div>loading...</div>;

    let people = data[0];

    
    return (<SingleColumns>

      {people ? <PeopleProfileHeader people={people} /> : null}
      
      <PeopleActivities />

        {/* <Meta title={people.nickname} /> */}

        {/* 
        <div styleName="header">

          <div styleName="profile">
            <div styleName="actions">
              <Follow user={people} />
              <ReportMenu user={people} />
            </div>
            <img styleName="avatar" src={people.avatar_url.replace('thumbnail/!50', 'thumbnail/!300')} />
            <div styleName="nickname">
              {people.nickname}
            </div>
            {Reflect.has(people, 'gender') && people.gender != null ?
                <div>性别：{people.gender == 1 ? '男' : '女'}</div>
                : null}
            <div>{people.brief}</div>
            
          </div>

        </div>
        */}
      
    </SingleColumns>)

  }

}