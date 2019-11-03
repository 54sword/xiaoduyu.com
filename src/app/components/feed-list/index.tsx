import React from 'react';
import { useStore, useSelector } from 'react-redux';
import { loadFeedList } from '@app/redux/actions/feed';
import { getFeedListById } from '@app/redux/reducers/feed';

// 依赖组件
import PostsItem from '@app/components/posts-list/components/item-rich';
import CommentItem from './components/item-comment';

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
  const list = useSelector((state: any) => getFeedListById(state, id));

  return (<ListClass
    {...props}
    {...list}
    load={(params: any)=>loadFeedList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      if (item.comment_id) {
        return (<CommentItem key={item._id} posts={item.posts_id} comment={item.comment_id} />)
      } else 
      if (item.posts_id) {
        return (<PostsItem key={item._id} posts={item.posts_id} switchHasRead={false} />)
      }
    }}
  />)

}