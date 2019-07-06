import React from 'react';
import useReactRouter from 'use-react-router';

// components
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import BlockList from '@modules/block-list';
import SingleColumns from '../../layout/single-columns';

export default Shell(function() {

  const { history, location, match } = useReactRouter();
  
  const { pathname } = location;

  let query: any = {}, title = '';

  if (pathname.indexOf('peoples') != -1) {
    title = '不感兴趣的用户';
    query.people_id = 'exists';
  }

  if (pathname.indexOf('posts') != -1) {
    title = '不感兴趣的帖子';
    query.posts_id = 'exists';
  }

  if (pathname.indexOf('comments') != -1) {
    title = '不感兴趣的评论';
    query.comment_id = 'exists';
  }

  return(<SingleColumns>
    <Meta title={title} />
    <BlockList id={pathname} query={query} />
  </SingleColumns>)
})

/*
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
*/
