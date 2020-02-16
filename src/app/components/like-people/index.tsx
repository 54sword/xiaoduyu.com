import React, { useEffect } from 'react';

import { useSelector, useStore } from 'react-redux';
import { loadLikeList } from '@app/redux/actions/like';
import { getLikeListById } from '@app/redux/reducers/like';

// class
import ListClass from '@app/class/list';
import Item from './item';

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
  //
  nothing?: string;
}

export default function(props: Props) {

  const { id } = props;

  const store = useStore();

  const list = useSelector((state: any) => {
    return getLikeListById(state, id)
  });



  return (
    <ListClass
      {...props}
      {...list}
      nothing=""
      load={(params: any)=>loadLikeList(params)(store.dispatch, store.getState)}
      renderItem={(item: any, index: number)=>{
        return <Item data={item} key={item._id} index={index} />
      }}
      />
  )

}