import React from 'react';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';

import BlockList from '@modules/block-list';

import SingleColumns from '../../layout/single-columns';

@Shell
export default class Blocks extends React.PureComponent {

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

    return(<SingleColumns>
      <Meta title={title} />
      <BlockList id={pathname} filters={filters} />
    </SingleColumns>)
  }

}
