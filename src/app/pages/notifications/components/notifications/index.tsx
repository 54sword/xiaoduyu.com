import React from 'react'
import useReactRouter from 'use-react-router';
import { Link } from 'react-router-dom';
import { useSelector, useStore } from 'react-redux';
import { getUserInfo } from '@app/redux/reducers/user';
import { getUnreadNotice } from '@app/redux/reducers/website';
import { loadNewNotifications } from '@app/redux/actions/notification';
import { getNotificationListById } from '@app/redux/reducers/notification';

// components
import Loading from '@app/components/ui/loading';

import UserNotificationList from './components/list';
import SingleColumns from '@app/layout/single-columns';

// style
import './styles/index.scss';

export default () => {

  const { history, location, match } = useReactRouter();
  
  const me = useSelector(getUserInfo);
  const unreadNotice = useSelector(getUnreadNotice);
  const newList = useSelector((state: any)=>getNotificationListById(state, 'new'));
  const store = useStore();
  const _loadNewNotifications = (params: any) => loadNewNotifications(params)(store.dispatch, store.getState);
  const typeList: any = {
    'unread': {
      name: '未读',
      filters: {
        has_read: false,
        sort_by: 'create_at:-1'
      }
    },
    'all': {
      name: '全部',
      filters: {
        sort_by: 'create_at:-1'
      }
    },
    'comment': {
      name: '评论',
      filters: {
        type: 'comment',
        sort_by: 'create_at:-1'
      }
    },
    'reply': {
      name: '回复',
      filters: {
        type: 'reply',
        sort_by: 'create_at:-1'
      }
    },
    'follow': {
      name: '关注',
      filters: {
        type: 'follow-you',
        sort_by: 'create_at:-1'
      }
    },
    'like': {
      name: '赞',
      filters: {
        type: 'like-comment,like-reply,like-posts',
        sort_by: 'create_at:-1'
      }
    }
  }

  const { pathname = 'notifications' } = location || {};
  
  let filters: any = {};

  let type: any;
  
  if (pathname == '/notifications') {
    type = typeList['unread'];
  } else {
    type = typeList[pathname.replace('/notifications/', '')];
  }

  if (!type) {
    return (<div>没有该分类</div>)
  }

  filters = type.filters;

  filters.addressee_id = me._id;

  return (<SingleColumns>

      <div className="card">

      {/* <div className="card-header">
        <div className="card-title">我的通知</div>
      </div> */}
        
      <div className="card-body border-bottom">
        <ul>
          {Reflect.ownKeys(typeList).map((item: any) => {
            let _type = typeList[item];
            return (<Link
              to={`/notifications${item == 'unread' ? '' : '/'+item}`}
              key={item}
              className={`mr-4 ${type.name == _type.name ? 'text-primary' : 'text-dark'}`}
              >
              {_type.name}</Link>)
          })}
        </ul>
      </div>
      
      {(()=>{
        
        if (pathname != '/notifications') return;
        
        if (newList && newList.loading) {
          return <Loading />
        } else if (unreadNotice.length > 0) {
          return <div onClick={()=>{
            _loadNewNotifications({ name: '/notifications' });
          }} styleName="unread-tip">你有 {unreadNotice.length} 未读通知</div>
        }
      })()}
      
      <UserNotificationList
        id={pathname}
        query={filters}
        scrollLoad={true}
      />

      </div>

  </SingleColumns>)

}