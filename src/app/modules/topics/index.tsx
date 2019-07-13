import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@actions/topic';
import { getTopicListById } from '@reducers/topic';
import { getUserInfo } from '@reducers/user';

// import Render from './render';
import Loading from '@components/ui/loading';
import './index.scss';

export default function() {

  const me = useSelector((state: object)=>getUserInfo(state));
  const topicList = useSelector((state: object)=>getTopicListById(state, 'recommend-topics'));

  const store = useStore();
  const _loadTopicList = ((args: object)=>loadTopicList(args)(store.dispatch, store.getState));

  const { data = [], loading = false } = topicList || {};
  
  useEffect(()=>{

    // if (loading) return;

    if ( data.length == 0) {
      _loadTopicList({
        id: 'recommend-topics',
        args: {
          type: "parent", recommend: true, sort_by: 'sort:-1'
        }
        // filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

  },[]);

  const length = 20;

  if (loading) {
    return (<div className="card">
      <div className="card-body"><Loading /></div>
    </div>)
  }

  return (<div className="card">
      
    <div className="card-header d-flex justify-content-between">
      <span>交流话题</span>
      {me ?
        <Link to="/new-posts" className="text-primary d-block d-md-none d-lg-none d-xl-none">+发帖</Link>
        : null}
    </div>

    <div className="card-body" styleName="container">
      {data.map((item: any)=>{
        return (<div key={item._id} styleName="group">
          <div styleName="group-title">
            <Link key={item._id} to={`/topic/${item._id}`}>{item.name}</Link>
          </div>
          <div>
            
            {item.children && item.children.map((subitem: any, index: number)=>{
              if (index >= length) return;
              return (<Link
                key={subitem._id}
                to={`/topic/${subitem._id}`}
                >
                {subitem.name}
              </Link>)
            })}

          </div>
        </div>)
      })}
    </div>

  </div>)

  // return <Render loading={loading} topicList={data} me={me} />
}