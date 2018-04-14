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
      <PeopleDetailHead id={id} body={<FollowList
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
            avatar
            fans_count
            comment_count
            follow_people_count
            follow
          }
        `}
      />}
      />
    </div>)
  }

}


export default Shell(PeopleDetailPosts);
