import React from 'react';

// layout
import TwoColumns from '../../layout/two-columns';

// config
import { description } from '@config';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Topics from '@modules/topics';
import AppDownload from '@modules/app-download';
import LinksExchange from '@modules/links-exchange';
import OperatingStatus from '@modules/operating-status';
import Footer from '@modules/footer';
import Case from '@modules/case';
import ADPC from '@modules/ads/pc';

import PostsList from '@modules/posts-list';
import NewTips from '@modules/posts-list/components/new-tips';

export default Shell(() => {

  return(<div>

    <Meta>
      <meta name="description" content={description} />
    </Meta>

    <TwoColumns>
      
      <div>
        <Topics />
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
      
      <div>

        <div className="card">
        <div className="card-header">推荐</div>
        <div className="card-body p-0">
          <PostsList
            id="excellent"
            itemType="poor"
            query={{
              sort_by: "sort_by_date",
              deleted: false,
              weaken: false,
              recommend: true
            }}
            />
        </div>
        </div>
        
        <AppDownload />
        <Case />
        <LinksExchange />
        
        <OperatingStatus />
      </div>

      <div>
        <ADPC width='280px' height='280px' />
        <Footer />
      </div>

    </TwoColumns>
  </div>)

})
