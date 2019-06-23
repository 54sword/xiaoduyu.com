import React, { Component } from 'react';

// 依赖的外部功能
// import { bindActionCreators } from 'redux';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { loadPostsList } from '@actions/posts';
import { getPostsListById } from '@reducers/posts';

import ItemRich from './components/item-rich';
import ItemPoor from './components/item-poor';
// import NewTips from './components/new-tips';

// class
import ListClass from '../../class/list';

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
    load={params=>loadPostsList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      if (itemType == 'poor') {
        return (<ItemPoor key={item._id} posts={item} />)
      }
      return (<ItemRich key={item._id} posts={item} />)
    }}
  />)

}
