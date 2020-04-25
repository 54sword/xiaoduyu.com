import React from 'react';

// config
import { name, description, domainName } from '@config';

// redux
import { useSelector, useStore } from 'react-redux';
import { getTab } from '@app/redux/reducers/website';
import { getTopicListById } from '@app/redux/reducers/topic';
import { saveTab } from '@app/redux/actions/website';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

// components
import Discover from './components/discover';
import FollowFeed from './components/follow';
import Favorte from './components/favorite';
import Live from './components/live';
import Topic from './components/topic';

const Home = () => {

  const tab = useSelector((state: object)=>getTab(state));

  const parentTopicList = useSelector((state: object)=>getTopicListById(state, 'parent-topics'));

  let topicIds: any = {};
  
  if (parentTopicList && parentTopicList.data && parentTopicList.data.length > 0) {
    parentTopicList.data.map((item: any)=>{
      topicIds[item._id] = item;
    });
  }

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
      <link rel="alternate" type="application/rss+xml" title={`${name} RSS 2.0`} href={`${domainName}/feed/`} />
      <link rel="alternate" type="application/atom+xml" title={`${name} Atom 1.0`} href={`${domainName}/feed/atom/`} />
    </Meta>

    {(()=>{

      let content = null;

      if (tab == 'follow') {
        content = <FollowFeed />;
      } else if (tab == 'favorite') {
        content = <Favorte />;
      } else if (tab == 'live') {
        content = <Live />;
      } else if (topicIds[tab]) {
        content = <Topic topic={topicIds[tab]} />
      } else {
        content = <Discover />
      }

      return (<div>{content}</div>)
    })()}

  </div>)

}


Home.loadDataOnServer = async function({ store, match, res, req, user }: any) {

  let topic = req.cookies['tab'] || 'home';

  saveTab(topic)(store.dispatch, store.getState);

  if (topic == 'home') await Discover.loadDataOnServer({ store, match, res, req, user });

  return { code:200 }
}

export default Shell(Home)
