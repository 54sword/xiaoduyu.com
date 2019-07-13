import React from 'react';
import { useSelector, useStore } from 'react-redux';
import { loadNotifications } from '@actions/notification';
import { getNotificationListById } from '@reducers/notification';

// components
import Item from './components/item';

// style
import './index.scss';

// class
import ListClass from '../../../../class/list';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  //
  nothing?: string;
}

export default function(props: Props) {

  const { id } = props;

  const store = useStore();

  const list = useSelector((state: any) => getNotificationListById(state, id));
  
  return (<ListClass
    {...props}
    {...list}
    load={params=>loadNotifications(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <Item notification={item} key={item._id} />
    }}
  />)

}