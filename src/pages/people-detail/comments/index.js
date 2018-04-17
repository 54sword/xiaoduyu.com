import React from 'react';

import Shell from '../../../components/shell';
import Meta from '../../../components/meta';
import PeopleDetailHead from '../../../components/people-detail-head';
// import PostsList from '../../../components/posts/list';
import CommentList from '../../../components/comment/list';

class PeopleDetailPosts extends React.Component {

  static loadData = PeopleDetailHead.loadData

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const { id } = this.props.match.params;

    // console.log(id);

    return (<PeopleDetailHead
        id={id}
        body={<div style={{backgroundColor:'#fff'}}><CommentList
          name={id}
          filters={{
            variables: {
              user_id: id,
              sort_by: "create_at",
              parent_id: false,
              deleted: false,
              weaken: false
              // parent_id: 'not-exists'
            }
          }}
          scrollLoad={true}
        /></div>}
      />)
  }

}


export default Shell(PeopleDetailPosts);
