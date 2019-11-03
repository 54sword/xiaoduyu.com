import React from 'react';

// 依赖的外部功能
import { useSelector, useStore } from 'react-redux';
import { loadPostsList } from '@app/redux/actions/posts';
import { getPostsListById } from '@app/redux/reducers/posts';

import ItemRich from './components/item-rich';
import ItemPoor from './components/item-poor';

// class
import ListClass from '@app/class/list';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  // 渲染项的类型
  itemType?: string;
  //
  nothing?: string;
}

export default function(props: Props) {

  const { id, itemType } = props;

  const store = useStore();

  const list = useSelector((state: any) => {
    return getPostsListById(state, id)
  });

  return (<ListClass
    {...props}
    {...list}
    load={(params: any)=>loadPostsList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      if (itemType == 'poor') {
        return (<ItemPoor key={item._id} posts={item} />)
      }
      return (<ItemRich key={item._id} posts={item} />)
    }}
  />)

}
