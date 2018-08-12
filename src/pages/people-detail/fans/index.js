import React from 'react';

import Shell from '../../../components/shell';
import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
import FollowList from '../../../components/follow-list';

import PeopleList from '../../../components/people/list';

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
    </div>)
  }

}


export default Shell(PeopleDetailPosts);
