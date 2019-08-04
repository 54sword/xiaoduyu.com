import React, { useState, useEffect } from 'react';
import { getOnline, getOperatingStatus } from '@app/redux/reducers/website';
import { Link } from 'react-router-dom';

// redux
import { useSelector } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';

// modules
// import Topics from '@app/modules/topics';

import PostsList from '@app/modules/posts-list';
import NewTips from '@app/modules/posts-list/components/new-tips';

import './styles/index.scss';

export default () => {

  const [ mount, setMount ] = useState(false);
  const me = useSelector(getUserInfo);
  const online = useSelector((state: object)=>getOnline(state));
  const operatingStatus = useSelector((state: object)=>getOperatingStatus(state));

  const { connect, member, visitor } = online;

  useEffect(()=>{
    setMount(true);
  }, []);

  return(
    <>
    {/* <Topics /> */}

    <div className="card">
      
      {/* 
      <div className="card-head d-flex justify-content-between align-items-center">

        <div styleName="add">
          {me ?
          <Link to="/new-posts">
            有什么想与大家交流？
          </Link>
          : 
          <a href="javascript:void(0)" data-toggle="modal" data-target="#sign" data-type="sign-up">
            有什么想与大家交流？
          </a>}
        </div>
        
        {mount ? 
          <div className="text-secondary">
            {visitor ? <span>{`游客 ${visitor}`}, </span> : ''}
            <span>会员 {member}/{operatingStatus.users}</span>
          </div>
          : null}

      </div>
      

      <div styleName="line" className="border-bottom"></div>
      */}
      
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
  );

}
