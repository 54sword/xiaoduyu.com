import React, { Component } from 'react';
import PropTypes from 'prop-types';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFeedList } from '@actions/feed';
import { getFeedListById } from '@reducers/feed';

// 依赖组件
import PostsItem from '../posts-list/components/item-rich';
import CommentItem from './components/item-comment';

import Pagination from '@components/pagination';
// import Loading from '@components/ui/content-loading';
import Loading from '@components/ui/content-loading';
import NewTips from './components/new-tips';

// styles
import './index.scss';

/**
 * 帖子列表组件
 *
 * @params {String} id 列表id - id 相同可以避免重复加载数据
 * @params {String} filters 筛选条件
 * @params {String} [itemName] 显示那种样式
 * @params {Boolean} [showPagination] 是否显示翻页
 * @params {Boolean} [scrollLoad] 是否开启滚动到底部加载更多
 */
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
    showTips: false
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

    const { id, list, showPagination, showTips, scrollLoad } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center mt-4 md-4">没有查询到结果</div>
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
