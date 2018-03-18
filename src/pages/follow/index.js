import React from 'react';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';

export class Follow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    let filter = {
      variables: {
        method: 'user_follow',
        sort_by: "create_at",
        deleted: false,
        weaken: false
      }
    }

    let newFilter = JSON.parse(JSON.stringify(filter));
    newFilter.variables.page_size = 10;

    return(<div>
      <Meta title="关注" />
      <div className="container">
      <div className="row">
        <div className="col-md-9">
          <PostsList
            id={'follow'}
            filters={filter}
            showPagination={false}
            scrollLoad={true}
            />
        </div>
        <div className="col-md-3">
          <Sidebar
            recommendPostsDom={(<PostsList
              id={'sidebar-follow'}
              itemName="posts-item-title"
              showPagination={false}
              filters={newFilter}
              />)}
            />
        </div>
      </div>
      </div>

    </div>)
  }

}

export default Shell(Follow);
