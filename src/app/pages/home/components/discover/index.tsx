import React from 'react';
import { Link } from 'react-router-dom';

// layout
import TwoColumns from '@app/layout/two-columns';

// redux
import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { loadPostsList } from '@app/redux/actions/posts';

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



const Discover = () => {

  const me = useSelector((state: object)=>getUserInfo(state));

  return(<>

    <TwoColumns>

      <div>
        <NewTips topicId="home" />
        <div className="card">
        <div className="card-header"><span className="card-title">发现</span></div>
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

        {me ? <Link to="/new-posts" className="btn btn-primary btn-block" style={{marginBottom:'10px'}}>发布话题</Link> : <Slogan />}

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

  await loadPostsList({
    id:'home',
    args: {
      sort_by: "sort_by_date",
      weaken: false
    }
  })(store.dispatch, store.getState)
}

export default Discover