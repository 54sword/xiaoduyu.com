import React from 'react';

// components
import Shell from '@components/shell';
import Meta from '@components/meta';

// modules
import Topics from '@modules/topics';
import FeedList from '@modules/feed-list';
// import NewFeedTips from '@modules/new-feed-tips';
// import AppDownload from '@modules/app-download';
// import Links from '@modules/Links';
// import OpenSource from '@modules/open-source';
// import OperatingStatus from '@modules/operating-status';
// import Footer from '@modules/footer';

// import GoBack from '@modules/go-back';

// layout
import ThreeColumns from '../../layout/three-columns';

// style
import './style.scss';

@Shell
export default class Follow extends React.PureComponent {

  render() {

    return(<div>
      
      <Meta title="关注" />

      <ThreeColumns>

        <div>
          <Topics />
        </div>
        
        <div>
          {/* <NewFeedTips /> */}
          <FeedList
            id={'follow'}
            filters={{
              variables: {
                preference: true,
                sort_by: "create_at:-1"
              }
            }}
            scrollLoad={true}
            />
        </div>
        
        
        <>
        {/*
          <AppDownload />
          <OpenSource />
          <OperatingStatus />
          <Links />
          <Footer />
          */}
        </>
        

      </ThreeColumns>

    </div>)
  }

}
