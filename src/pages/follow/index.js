import React from 'react';

// redux
import { loadPostsList } from '../../actions/posts';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';

let general = {
  variables: {
    method: 'user_follow',
    sort_by: "create_at",
    deleted: false,
    weaken: false
  }
}

let recommend = {
  variables: {
    method: 'user_follow',
    sort_by: "comment_count,like_count,create_at",
    deleted: false,
    weaken: false,
    page_size: 10
  },
  select: `
    _id
    title
    user_id{
      _id
      avatar_url
    }
  `
}

export class Follow extends React.Component {

  static loadData({ store, match }) {
    return new Promise(resolve => {

      Promise.all([
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: 'follow',
            filters: general
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        }),
        new Promise(async resolve => {
          let [ err, result ] = await loadPostsList({
            id: '_follow',
            filters: recommend
          })(store.dispatch, store.getState);
          resolve([ err, result ])
        })
      ]).then(value=>{
        resolve({ code:200 });
      });

    })
  }

  constructor(props) {
    super(props);
  }

  render() {

    return(<div>

      <Meta title="关注" />

      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <PostsList
              id={'follow'}
              filters={general}
              scrollLoad={true}
              />
          </div>
          <div className="col-md-3">
            <Sidebar
              recommendPostsDom={(<PostsList
                id={'_follow'}
                itemName="posts-item-title"
                filters={recommend}
                />)}
              />
          </div>
        </div>
      </div>

    </div>)
  }

}

export default Shell(Follow);
