import React from 'react';

// components
import Shell from '../../components/shell';
import Meta from '../../components/meta';
import BlockList from '../../components/block/list';

@Shell
export default class Blocks extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const { pathname } = this.props.location;

    let filters = {}, title = '';

    if (pathname.indexOf('peoples') != -1) {
      title = '不感兴趣的用户';
      filters.people_id = 'exists';
    }
    if (pathname.indexOf('posts') != -1) {
      title = '不感兴趣的帖子';
      filters.posts_id = 'exists';
    }

    if (pathname.indexOf('comments') != -1) {
      title = '不感兴趣的评论';
      filters.comment_id = 'exists';
    }

    return(<div>
      <Meta title={title} />
      <BlockList id={pathname} filters={filters} />
    </div>)
  }

}
