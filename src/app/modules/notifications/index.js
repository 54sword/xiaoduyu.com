import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getProfile } from '@reducers/user';
import { getUnreadNotice } from '@reducers/website';
import { loadNewNotifications } from '@actions/notification';
import { getNotificationListById } from '@reducers/notification';

// components
import Loading from '@components/ui/loading';

import UserNotificationList from '@modules/notifications/components/list';
import SingleColumns from '../../layout/single-columns';

// style
import './index.scss';

@withRouter
@connect(
  (state, props) => {
    return {
      me: getProfile(state),
      unreadNotice: getUnreadNotice(state),
      list: getNotificationListById(state, props.location.pathname),
      // 未读通知
      newList: getNotificationListById(state, 'new')
    }
  },
  dispatch => ({
    loadNewNotifications: bindActionCreators(loadNewNotifications, dispatch)
  })
)
export default class Notifications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      typeList: {
        'unread': {
          name: '未读消息',
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
    }
  }

  render () {

    const { me, list, unreadNotice, newList, loadNewNotifications, notFoundPgae } = this.props;
    const { typeList } = this.state;
    const { pathname = 'notifications' } = this.props.location || {};
    
    let filters = {};

    let type;
    
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
      
        <div className="card p-2">
          <ul>
            {Reflect.ownKeys(typeList).map(item=>{
              let _type = typeList[item];
              return (<Link to={`/notifications${item == 'unread' ? '' : '/'+item}`} key={item} className={`btn btn-sm ${type.name == _type.name ? 'btn-primary' : 'btn-link'}`}>{_type.name}</Link>)
            })}
          </ul>
        </div>
        
        {(()=>{
          
          if (pathname != '/notifications') return;
          
          if (newList && newList.loading) {
            return <Loading />
          } else if (unreadNotice.length > 0) {
            return <div onClick={()=>{
              loadNewNotifications({ name: '/notifications' });
            }} styleName="unread-tip">你有 {unreadNotice.length} 未读通知</div>
          }
        })()}
        
        <UserNotificationList
          name={pathname}
          filters={{
            variables: filters
          }}
        />

    </SingleColumns>)
  }
}
