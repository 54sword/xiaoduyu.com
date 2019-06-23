import React, { Component } from 'react';
// import PropTypes from 'prop-types';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect, useStore, useSelector } from 'react-redux';
import { loadFeedList } from '@actions/feed';
import { getFeedListById } from '@reducers/feed';

// 依赖组件
import PostsItem from '../posts-list/components/item-rich';
import CommentItem from './components/item-comment';

// import Pagination from '@components/pagination';
// import Loading from '@components/ui/content-loading';
// import Loading from '@components/ui/content-loading';
// import NewTips from './components/new-tips';

// class
import ListClass from '../../class/list';

// styles
import './index.scss';

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
    load={params=>loadFeedList(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      if (item.comment_id) {
        return (<CommentItem key={item._id} posts={item.posts_id} comment={item.comment_id} />)
      } else if (item.posts_id) {
        return (<PostsItem key={item._id} posts={item.posts_id} />)
      }
    }}
  />)

}

/*
@connect(
  (state, props) => ({
    list: getFeedListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadFeedList, dispatch)
  })
)
export default class PostsList extends Component {

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    // 显示项
    // itemName: 'posts-item',
    // 是否显示翻页
    showPagination: false,
    // 滚动底部加载更多
    scrollLoad: false,
    // 是否显示tips
    showTips: false,
    // 没有数据时候的提示
    nothingTips: '没有更多数据'
  }

  constructor(props) {
    super(props);
    this.state = {}
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {
    const { list, id, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {

    if (props.id != this.props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }

  }

  async loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    await loadList({ id, filters: _filters, restart });
  }

  render () {

    const { id, list, showPagination, showTips, scrollLoad, nothingTips } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return (<div className="card">
        <div className="card-body text-center text-secondary">
          {nothingTips}
        </div>
      </div>)
    }
    
    return (<div>
      
      {!loading && showTips ? <NewTips topicId={id} /> : null}

      {data && data.map(item=>{
        if (item.comment_id) {
          return (<CommentItem key={item._id} posts={item.posts_id} comment={item.comment_id} />)
        } else if (item.posts_id) {
          return (<PostsItem key={item._id} posts={item.posts_id} />)
        }
      })}
        
      {!more || !scrollLoad ? null : <Loading />}

      {showPagination ?
        <Pagination
          count={count || 0}
          pageSize={filters.page_size || 0}
          pageNumber={filters.page_number || 0}
          // positionY={positionY}
        />: null}

    </div>)
  }

}
*/