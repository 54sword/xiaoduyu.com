import React from 'react';
import { Link } from 'react-router-dom';

import Loading from '@components/ui/loading';
import './index.scss';

export default ({ loading = false, topicList = [], me }) => {

  const length = 20;

  if (loading) {
    return (<div className="card">
      <div className="card-body"><Loading /></div>
    </div>)
  }

  return (<>
    <div className="card">
      
      <div className="card-header d-flex justify-content-between">
        <span>交流话题</span>
        {me ?
          <Link to="/new-posts" className="text-primary d-block d-md-none d-lg-none d-xl-none">+发帖</Link>
          : null}
      </div>

      <div className="card-body" styleName="container">
        {topicList.map(item=>{
          return (<div key={item._id} styleName="group">
            <div styleName="group-title">
              <Link key={item._id} to={`/topic/${item._id}`}>{item.name}</Link>
            </div>
            <div>
              
              {item.children && item.children.map((subitem, index)=>{
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


    </div>
  
    </>
  )
}