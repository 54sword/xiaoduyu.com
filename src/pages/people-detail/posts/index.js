import React from 'react';

import Shell from '../../../components/shell';
// import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
import PostsList from '../../../components/posts/list';
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
      />
      <Sidebar />
    </Box>)
  }

}
