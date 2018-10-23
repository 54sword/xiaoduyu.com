import React from 'react';

// redux
// import { loadPostsList } from '../../actions/posts';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';
// import Bundle from '../../components/bundle';
import NewPostsButton from '../../components/new-posts-button';

// style
import CSSModules from 'react-css-modules';
import styles from './style.scss';

let general = {
  variables: {
    sort_by: "sort_by_date",
    deleted: false,
    weaken: false
  }
}

let recommend = {
  variables: {
    sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
    deleted: false,
    weaken: false,
    page_size: 10,
    start_create_at: (new Date().getTime() - 1000 * 60 * 60 * 24 * 30)+''
  }
}

@Shell
export default class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { pathname, search } = this.props.location;
    const { isMember } = this.props;

    {/*
    <Sidebar
      recommendPostsDom={(<PostsList
        id={'_home'}
        itemName="posts-item-title"
        filters={recommend}
      />)}
      />
    */}

    return(<div>
      <Meta />

      {/*
      <PostsList
        id={'home'}
        filters={general}
        scrollLoad={true}
        />
      */}


      <div className="container">
        <div className="row">
          <div className="col-md-8">

            <PostsList
              id={'home'}
              filters={general}
              scrollLoad={true}
              />
          </div>
          <div className="col-md-4">
            <Sidebar
              recommendPostsDom={(<PostsList
                id={'_home'}
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
