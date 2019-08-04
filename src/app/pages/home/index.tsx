import React, { useEffect } from 'react';

// layout
import SingleColumns from '@app/layout/single-columns';
// import TwoColumns from '@app/layout/two-columns';

// config
import { description } from '@config';

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
// import PostsList from '@app/modules/posts-list';

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
    </Meta>
    <SingleColumns>
      {tab == 'home' ? 
        <div>
          <Topics />
          <HomeFeed />
        </div>
      : 
      <FollowFeed />}
    </SingleColumns>
  </div>)

})
