import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useSelector, useStore } from 'react-redux';
import { loadTopicList } from '@app/redux/actions/topic';
import { getTopicListById } from '@app/redux/reducers/topic';
import { getUserInfo } from '@app/redux/reducers/user';

import Loading from '@app/components/ui/loading';
import './styles/index.scss';

export default function({ showAll = false }: { showAll?: boolean }) {
  
  const [ expand, setExpand ] = useState(false);

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

  const length = 16;

  if (loading) {
    return (<div styleName="container">
      <div className="card-body"><Loading /></div>
    </div>)
  }

  return (
    <div>
  <div className="card">
    
    <div className="card-head">
      <span className="card-title">交流话题</span>
    </div>

    <div className="card-body" styleName="container">
      {data.map((item: any)=>{

        if (item.children == 0) return;

        return (<div key={item._id} styleName="group" className="border-bottom">
          <div styleName="group-title">
            <Link to={`/topic/${item._id}`}>{item.name}</Link>
          </div>
          <div>
            {item.children && item.children.map((subitem: any, index: number)=>{
              if (index >= length && !showAll) return;
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
  </div>

  {/* {!showAll ?
    <Link to="/topic">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinecap="round" className="feather feather-chevron-right mr-2 text-secondary"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </Link>
    : null} */}


  </div>)

  // return <Render loading={loading} topicList={data} me={me} />
}