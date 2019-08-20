import React, { useEffect } from 'react';

// layout
// import SingleColumns from '@app/layout/single-columns';
import TwoColumns from '@app/layout/two-columns';

// config
import { name, description, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { getTab } from '@app/redux/reducers/website';
import { saveScrollPosition, setScrollPosition } from '@app/redux/actions/scroll';

// modules
import Shell from '@app/modules/shell';
import Meta from '@app/modules/meta';

// components
import HomeFeed from './components/home-feed';
import FollowFeed from './components/follow-feed';
import Topics from './components/topics';
import PostsList from '@app/modules/posts-list';

// import AppDownload from '@app/modules/app-download';
import LinksExchange from '@app/modules/links-exchange';
import OperatingStatus from '@app/modules/operating-status';
import Footer from '@app/modules/footer';
import Case from '@app/modules/case';
import ADPC from '@app/modules/ads/pc';

export default Shell(() => {

  const tab = useSelector((state: object)=>getTab(state));
  const store = useStore();

  useEffect(()=>{
    setScrollPosition(tab)(store.dispatch, store.getState);
    return ()=>{
      saveScrollPosition(tab)(store.dispatch, store.getState);
    }
  }, []);

  

  return(<div>
    
    <Meta>
      <meta name="description" content={description} />
      <meta property="og:locale" content="zh_CN" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={domainName} />
      <meta property="og:site_name" content={name} />
      <meta property="og:image" content={domainName+'/512x512.png'} />
      <meta property="og:image:width" content="512" />
      <meta property="og:image:height" content="512" />
    </Meta>

    <TwoColumns>
      {tab == 'home' ? 
        <div>
          <Topics />
          <HomeFeed />
        </div>
      : 
      <FollowFeed />}

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

        <div className="card">
        <div className="card-header">最热</div>
        <div className="card-body p-0">
          <PostsList
            id="hot"
            itemType="poor"
            query={{
              sort_by: "comment_count:-1,like_count:-1,sort_by_date:-1",
              start_create_at: new Date(Math.floor(new Date().getTime()/100000)*100000 - 1000 * 60 * 60 * 24 * 7)+'',
              deleted: false,
              weaken: false,
              page_size: 9
            }}
            />
        </div>
        </div>

        <div className="card">
          <div className="card-body" style={{padding:'15px'}}>
            <ADPC width="250px" height="250px" />
          </div>
        </div>
        
        <Case />
        <LinksExchange />
        <OperatingStatus />
        <Footer />
      </div>

    </TwoColumns>
  </div>)

})
