import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// redux
import { bindActionCreators } from 'redux';
import { connect, useSelector, useStore } from 'react-redux';
import { getCommentListById } from '@reducers/comment';
import { loadCommentList } from '@actions/comment';

// components
import CommentItem from './components/list-item';
// import Pagination from '@components/pagination';
// import Loading from '@components/ui/full-loading';

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
  // itemType?: string;
}

export default function(props: Props) {

  const { id } = props;
  const store = useStore();
  const list = useSelector((state: any) => {
    return getCommentListById(state, id)
  });

  return (<ListClass
    {...props}
    {...list}
    load={params=>loadCommentList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <CommentItem comment={item} key={item._id} />
    }}
  />)

}