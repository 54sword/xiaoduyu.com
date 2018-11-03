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
      />}
      />
      <Sidebar />
    </Box>)
  }

}
