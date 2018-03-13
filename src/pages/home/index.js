import React from 'react';
import PropTypes from 'prop-types';
import { loadPostsList } from '../../actions/posts';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

// 壳组件
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import PostsList from '../../components/posts/list';
import Sidebar from '../../components/sidebar';

@CSSModules(styles)
export class Home extends React.Component {

  // 服务端渲染
  // 加载需要在服务端渲染的数据
  static loadData({ store, match }) {
    return new Promise(async function (resolve, reject) {
      resolve({ code:200 });
    })
  }

  constructor(props) {
    super(props);
  }

  render() {
    return(<div>
      <Meta title="首页" />
      <div className="container">
      <div className="row">
        <div className="col-md-9">
          <PostsList
            id={'home'}
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
            id="sidebar_home"
            />
        </div>
      </div>
      </div>

    </div>)
  }

}

export default Shell(Home);
