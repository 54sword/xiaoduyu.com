import React from 'react';

// 依赖的外部功能
import { useStore, useSelector } from 'react-redux';
import { loadSessionList } from '@app/redux/actions/session';
import { getSessionListById } from '@app/redux/reducers/session';

import Item from './components/list-item';

// class
import ListClass from '@app/class/list';

// styles
import './styles/index.scss';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  // 没有数据的时候显示内容
  nothing?: any;
}

export default function(props: Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getSessionListById(state, id)
  });
  
  return (<ListClass
    {...props}
    {...list}
    load={(params: any)=>loadSessionList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <Item key={item._id} message={item} />
    }}
  />)

}