import React from 'react';

// redux
import { loadPostsList } from '../../actions/posts';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss';

@CSSModules(styles)
export class Home extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { pathname, search } = this.props.location

    return(<div>
      <Meta title="首页" />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <PostsList
              id={pathname+search}
              filters={{
                variables: {
                  sort_by: "create_at",
                  deleted: false,
                  weaken: false
                }
              }}
              showPagination={false}
              scrollLoad={true}
              />
          </div>
          <div className="col-md-3">
            <Sidebar
              recommendPostsDom={(<PostsList
                id={'sidebar-home'}
                itemName="posts-item-title"
                showPagination={false}
                filters={{
                  variables: {
                    sort_by: "create_at",
                    deleted: false,
                    weaken: false,
                    page_size: 10
                  }
                }}
                />)}
              />
          </div>
        </div>
      </div>

    </div>)
  }

}

export default Shell(Home);
