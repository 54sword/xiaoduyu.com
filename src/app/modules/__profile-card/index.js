
import React from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { getUserInfo } from '@reducers/user';

@connect(
  (state, props) => ({
    me: getUserInfo(state)
  }),
  dispatch => ({
  })
)
export default class ProfileCard extends React.PureComponent {
  render() {

    const { me } = this.props;

    if (!me) return null;

    return(
      <div className="card">
        <div className="card-body">
          <div className="text-center">
            <Link to={`/people/${me._id}`}>
              <img src={me.avatar_url} alt={me.nickname} className="rounded-circle" width="60" height="60" />
              <div className="mt-2 mb-3"><strong>{me.nickname}</strong></div>
            </Link>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-4 text-center">
                {me.follow_people_count}<br />
                <small className="text-secondary">关注</small>
              </div>
              <div className="col-4 text-center">
                {me.fans_count}<br />
                <small className="text-secondary">粉丝</small>
              </div>
              <div className="col-4 text-center">
                {me.posts_count}<br />
                <small className="text-secondary">帖子</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  }
}
