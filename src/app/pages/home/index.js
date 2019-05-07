import React from 'react';

// modules
import Shell from '@modules/shell';
import Meta from '@modules/meta';
import Topics from '@modules/topics';
import AppDownload from '@modules/app-download';
import LinksExchange from '@modules/links-exchange';
import OperatingStatus from '@modules/operating-status';
import Footer from '@modules/footer';
import MixingFeed from '@modules/mixing-feed';
import HotPostsList from '@modules/hot-posts-list';
import Case from '@modules/case';
import AdsByGoogle from '@modules/adsbygoogle';
import ProfileCard from '@modules/profile-card';
// import Test from '@modules/test';

// layout
import ThreeColumns from '../../layout/three-columns';

import { googleAdSense } from '@config';

@Shell
export default class Home extends React.PureComponent {

  render() {

    return(<>
      <Meta />

      <ThreeColumns>
        
        <>
          <Topics />
          <div className="d-none d-lg-block d-xl-block"><AppDownload /></div>
        </>
        
        <>
          <MixingFeed />
        </>
        
        <>
          <ProfileCard />
          {/* <div style={{marginBottom:10}}>
            <a href="https://geo.itunes.apple.com/cn/app/rss-reader-one/id544358974?l=en&mt=8" target="_blank">
              <img src="/rss-reader-one.png" alt="RSS Reader One" width="250" height="250" />
            </a>
          </div> */}
          {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
          <HotPostsList />
          <Case />
          <LinksExchange />
          <OperatingStatus />
          <Footer />
        </>

        <>
          <HotPostsList />
          {googleAdSense.sidebar ? <AdsByGoogle {...googleAdSense.sidebar} /> : null}
        </>

      </ThreeColumns>
    </>)
  }

}
