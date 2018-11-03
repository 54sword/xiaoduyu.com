import React from 'react';

import Shell from '../../../components/shell';
// import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
import FollowList from '../../../components/follow-list';

import Box from '../../../components/box';
import Sidebar from '../../../components/sidebar';

@Shell
export default class PeopleDetailPosts extends React.PureComponent {

  render() {
    const { id } = this.props.match.params;

    return (<Box>
      <PeopleDetailHead
        {...this.props}
        id={id}
        body={<FollowList
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
        />}
      />
      <Sidebar />
    </Box>)
  }

}
