import React from 'react';
import useReactRouter from 'use-react-router';

import SingleColumns from '@app/layout/single-columns';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';
import BlockList from '@app/components/block-list';

export default Shell(function() {

  const { history, location, match } = useReactRouter();
  
  const { pathname } = location;

  let query: any = {}, title = '';

  if (pathname.indexOf('peoples') != -1) {
    title = '不感兴趣的用户';
    query.people_id = 'exists';
  }

  if (pathname.indexOf('posts') != -1) {
    title = '不感兴趣的话题';
    query.posts_id = 'exists';
  }

  if (pathname.indexOf('comments') != -1) {
    title = '不感兴趣的评论/回复';
    query.comment_id = 'exists';
  }

  return(<SingleColumns>
    <Meta title={title} />
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-body p-0">
        <BlockList id={pathname} query={query} />
      </div>
    </div>
  </SingleColumns>)
})