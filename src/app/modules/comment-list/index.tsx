import React from 'react';

// redux
import { useSelector, useStore } from 'react-redux';
import { getCommentListById } from '@app/redux/reducers/comment';
import { loadCommentList } from '@app/redux/actions/comment';

// components
import CommentItem from './components/list-item';

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
  // itemType?: string;
  // 作者id
  postsAuthorId?: string
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
    load={(params: any)=>loadCommentList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <CommentItem comment={item} key={item._id} postsAuthorId={props.postsAuthorId || ''} />
    }}
  />)

}