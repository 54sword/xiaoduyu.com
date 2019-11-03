import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// redux
import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';
import { getUserInfo } from '@app/redux/reducers/user';

// layout
import SingleColumns from '@app/layout/single-columns';

// modules
import Shell from '@app/components/shell';
import Meta from '@app/components/meta';

import Loading from '@app/components/ui/loading';
import './styles/index.scss';

const Topic = () => {

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
          type: "parent",
          // recommend: true,
          sort_by: 'sort:-1'
        }
        // filters: { variables: { type: "parent", recommend: true, sort_by: 'sort:-1' } }
      });
    }

  },[]);

  if (loading) {
    return (<div styleName="container">
      <div className="card-body"><Loading /></div>
    </div>)
  }

  return(<div>
    <Meta title="话题" />
    <SingleColumns>

      <div className="card">
    
    <div className="card-header">
      <span className="card-title">交流话题</span>
    </div>

    <div className="card-body" styleName="container">
      {data.map((item: any)=>{

        if (item.children == 0) return;

        return (<div key={item._id} styleName="group" className="border-bottom">
          <div styleName="group-title">
            <Link to={`/topic/${item._id}`} className="text-dark">{item.name}</Link>
          </div>
          <div>
            {item.children && item.children.map((subitem: any, index: number)=>{
              // if (index >= length && !showAll) return;
              return (<Link
                key={subitem._id}
                className="text-dark"
                to={`/topic/${subitem._id}`}
                >
                {subitem.name}
              </Link>)
            })}
          </div>
        </div>)
      })}
    </div>
  </div>

    </SingleColumns>
  </div>)

}

Topic.loadDataOnServer = async function({ store, match, res, req, user }: any) {

  await loadTopicList({
    id: 'recommend-topics',
    args: {
      type: "parent",
      sort_by: 'sort:-1'
    }
  })(store.dispatch, store.getState);
  
  return { code:200 }

}

export default Shell(Topic)
