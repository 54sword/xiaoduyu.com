import React from 'react';
import useReactRouter from 'use-react-router';

import SingleColumns from '@app/layout/single-columns';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';
import BlockList from '@app/modules/block-list';

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