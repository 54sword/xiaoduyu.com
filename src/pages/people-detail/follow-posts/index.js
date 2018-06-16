import React from 'react';

import Shell from '../../../components/shell';
import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
import FollowList from '../../../components/follow-list';

class PeopleDetailPosts extends React.Component {

  static loadData = PeopleDetailHead.loadData

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { id } = this.props.match.params;

    return (<div>
      <PeopleDetailHead
        {...this.props}
        id={id}
        body={<FollowList
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
      />}
      />
    </div>)
  }

}


export default Shell(PeopleDetailPosts);
