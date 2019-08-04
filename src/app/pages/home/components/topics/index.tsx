import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';
import { getUserInfo } from '@app/redux/reducers/user';

// import Render from './render';
// import Loading from '@app/components/ui/loading';
import './index.scss';

export default function({ showAll = false }: { showAll?: boolean }) {
  
  const [ expand, setExpand ] = useState(false);

  const me = useSelector((state: object)=>getUserInfo(state));
  const topicList = useSelector((state: object)=>getTopicListById(state, 'home-topics'));

  const store = useStore();
  const _loadTopicList = ((args: object)=>loadTopicList(args)(store.dispatch, store.getState));

  const { data = [], loading = false } = topicList || {};
  
  useEffect(()=>{

    if ( data.length == 0) {
      _loadTopicList({
        id: 'home-topics',
        args: {
          type: "not-parent",
          sort_by: 'follow_count:-1,posts_count:-1,sort:-1',
          page_size: 16
        }
      });
    }

  },[]);

  return (<div className="card border-bottom">
    <div className="card-body">
      <div styleName="topic-list">
        {data.map((item: any)=>{
          return (<Link
            key={item._id}
            to={`/topic/${item._id}`}
            >
            {item.name}
          </Link>)
        })}
        <Link to="/topic">
          更多话题
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <use xlinkHref="/feather-sprite.svg#more-horizontal"/>
          </svg>
        </Link>
      </div>
    </div>
  </div>)
}