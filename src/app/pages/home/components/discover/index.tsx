import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// layout
import TwoColumns from '@app/layout/two-columns';

// redux
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadPostsList } from '@app/redux/actions/posts';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';

// components
import AppXiaoDuYu from './components/app-download';
import App1sMemory from './components/1s-memory';
import LinksExchange from './components/links-exchange';
import OperatingStatus from './components/operating-status';
import Slogan from './components/slogan';
import Footer from './components/footer';

import ADPC from '@app/components/ads/pc';
import PostsList from '@app/components/posts-list';
import NewTips from '@app/components/posts-list/components/new-tips';

import '../topic/styles/index.scss';

const Discover = () => {

  const store = useStore();
  const me = useSelector((state: object)=>getUserInfo(state));
  const topicList = useSelector((state: object)=>getTopicListById(state, 'discover-topics'));

  useEffect(()=>{

    if (!topicList) {
      loadTopicList({
        id: 'discover-topics',
        args: {
          parent_id: "exists",
          sort_by: 'last_posts_at:-1',
          page_size: 9
        }
      })(store.dispatch, store.getState);
    }

  }, []);

  return(<>

    <TwoColumns>

      <div>
        <NewTips topicId="home" />
        <div className="card">
        <div className="card-header">
          {/* <span className="card-title">发现</span> */}

          {topicList && topicList.data && topicList.data.length > 0 ?
          <div styleName="child-topic">
            {topicList.data.map(({ _id, name }: { _id: string, name: string })=>{
              return <Link key={_id} to={`/topic/${_id}`}>{name}</Link>
            })}
          </div>
          : null}

        </div>
        <div className="card-body p-0">
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
      </div>

      <div>

        {me ? <Link to="/new-posts" className="btn btn-primary btn-block" style={{marginBottom:'10px'}}>发帖</Link> : <Slogan />}

        <div className="card">
        <div className="card-header"><span className="card-title">推荐</span></div>
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
        
        <ADPC width="250px" height="250px" />
        <LinksExchange />
        <OperatingStatus />
        <AppXiaoDuYu />
        <App1sMemory />
        <Footer />
      </div>

      {/* <div>
        <ADPC width="250px" height="250px" />
        <Footer />
      </div> */}

    </TwoColumns>
  </>)
}

Discover.loadDataOnServer = async function({ store, match, res, req, user }: any) {  

  if (user) return;

  await loadTopicList({
    id: 'discover-topics',
    args: {
      parent_id: "exists",
      sort_by: 'last_posts_at:-1',
      page_size: 9
    }
  })(store.dispatch, store.getState);

  await loadPostsList({
    id:'home',
    args: {
      sort_by: "sort_by_date",
      weaken: false
    }
  })(store.dispatch, store.getState)
  
  await LinksExchange.loadDataOnServer({ store, match, res, req, user });
}

export default Discover