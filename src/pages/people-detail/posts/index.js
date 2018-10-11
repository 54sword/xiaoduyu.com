import React from 'react';

import Shell from '../../../components/shell';
import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
import PostsList from '../../../components/posts/list';

@Shell
export default class PeopleDetailPosts extends React.Component {

  static loadData = PeopleDetailHead.loadData

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    const { id } = this.props.match.params;

    return (<PeopleDetailHead
        {...this.props}
        id={id}
        body={<PostsList
          id={id}
          filters={{
            variables: {
              user_id: id,
              sort_by: "create_at",
              deleted: false
            }
          }}
          scrollLoad={true}
        />}
      />)
  }

}
