import React from 'react';
import { loadPostsList } from '../../actions/posts';

import CSSModules from 'react-css-modules';
import styles from './style.scss';

import PostsList from '../../components/posts/list';

@CSSModules(styles)
export default class Sidebar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { id, topic_id = '' } = this.props

    let variables = {
      sort_by: "sort_by_date",
      deleted: false,
      weaken: false,
      page_size: 10,
    }

    if (topic_id) {
      variables.topic_id = topic_id
    }

    return(<div>

      <div className="card">
        <div className="card-header">热门</div>
        <div className="card-body">
          <div styleName="recommend">
          <PostsList
            id={id}
            itemName="posts-item-title"
            showPagination={false}
            filters={{
              variables
            }}
            />
          </div>
        </div>
      </div>

      <div>
        <p>源代码地址</p>
        <p>© 2018 渡鱼</p>
      </div>

    </div>)
  }

}
