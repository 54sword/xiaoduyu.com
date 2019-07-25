import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getOnline, getOperatingStatus } from '@reducers/website';
import { Link } from 'react-router-dom';

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

  const [ mount, setMount ] = useState(false);
  const online = useSelector((state: object)=>getOnline(state));
  const operatingStatus = useSelector((state: object)=>getOperatingStatus(state));

  const { connect, member, visitor } = online;

  useEffect(()=>{
    setMount(true);
  }, []);

  return(<div>

    <Meta>
      <meta name="description" content={description} />
    </Meta>

    <SingleColumns>

      {/* <div className="card">
        <div className="card-body border-bottom d-flex justify-content-between align-items-center">
          <Link to="/new-posts" className="text-primary">说点什么呢...</Link>
          {mount ? 
            <small className="text-secondary">
              {visitor ? `游客${visitor}、` : ''}
              会员{member}/{operatingStatus.users}
            </small>
            : null}
        </div>
      </div> */}

      <Topics />

      <div className="card">

        {/* <div className="card-head pb-1 d-flex justify-content-between align-items-center">
          <span className="title">最新动态</span>
          {mount ? 
            <small className="text-secondary">
              {visitor ? `游客${visitor}、` : ''}
              会员{member}/{operatingStatus.users}
            </small>
            : null}
        </div> */}
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
