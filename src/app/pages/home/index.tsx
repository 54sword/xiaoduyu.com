import React, { useState, useEffect } from 'react';
import { getOnline, getOperatingStatus } from '@reducers/website';
import { Link } from 'react-router-dom';

// layout
import SingleColumns from '../../layout/single-columns';

// config
import { description } from '@config';

// redux
import { useSelector } from 'react-redux';
import { getTab } from '@reducers/website';

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


import FeedList from '@modules/feed-list';
import FeedNewTips from '@modules/feed-list/components/new-tips';

import './index.scss';

export default Shell(() => {

  const [ mount, setMount ] = useState(false);
  const online = useSelector((state: object)=>getOnline(state));
  const operatingStatus = useSelector((state: object)=>getOperatingStatus(state));
  const tab = useSelector((state: object)=>getTab(state));

  const { connect, member, visitor } = online;

  useEffect(()=>{
    setMount(true);
  }, []);

  return(<div>

    <Meta>
      <meta name="description" content={description} />
    </Meta>

    <SingleColumns>
      

      {tab == 'home' ?
      <>
        <Topics />

        <div className="card">
          <div className="card-head d-flex justify-content-between align-items-center">
            <Link to="/new-posts" styleName="add" className="text-primary">有什么想与大家交流？</Link>
            {/* {mount ? 
              <small className="text-secondary" styleName="status">
                {visitor ? <span>{`游客${visitor}`}</span> : ''}
                <span>会员{member}/{operatingStatus.users}</span>
              </small>
              : null} */}
          </div>
          <div className="border-bottom" style={{marginLeft:'83px'}}></div>
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
      </>
      :
        <div className="card">
        <div className="card-head pb-1">
          <div className="title">我的关注</div>
        </div>
        <div className="card-body p-0">
          <FeedNewTips topicId="feed" />
          <FeedList
            id='feed'
            query={{
              preference: true,
              sort_by: "create_at:-1"
            }}
            scrollLoad={true}
            nothing={'关注你感兴趣的人或话题，可以获得ta们的最新动态'}
            />
        </div>
        </div>
      }

    </SingleColumns>
  </div>)

})
