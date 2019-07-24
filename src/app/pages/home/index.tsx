import React from 'react';

// layout
import SingleColumns from '../../layout/single-columns';

// config
import { description } from '@config';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Topics from '@modules/topics';
// import AppDownload from '@modules/app-download';
// import LinksExchange from '@modules/links-exchange';
// import OperatingStatus from '@modules/operating-status';
// import Footer from '@modules/footer';
// import Case from '@modules/case';
// import ADPC from '@modules/ads/pc';

import PostsList from '@modules/posts-list';
import NewTips from '@modules/posts-list/components/new-tips';

import './index.scss';

export default Shell(() => {

  return(<div>

    <Meta>
      <meta name="description" content={description} />
    </Meta>

    <SingleColumns>
      
      <Topics />

      <div className="card">
        <div className="card-head pb-1">
          <span className="title">最新动态</span>
        </div>
        <div className="card-body p-0">
          <NewTips topicId="home" />
          <PostsList
            id="home"
            query={{
              sort_by: "sort_by_date",
              deleted: false,
              weaken: false
            }}
            scrollLoad={true}
            />
        </div>
      </div>

    </SingleColumns>
  </div>)

})
