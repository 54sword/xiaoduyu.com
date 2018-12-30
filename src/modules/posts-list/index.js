
/**
 * 帖子列表组件
 *
 * @params {String} id 列表id - id 相同可以避免重复加载数据
 * @params {String} filters 筛选条件
 * @params {String} [itemType] 显示列表项的类型
 * @params {Boolean} [showPagination] 是否显示翻页
 * @params {Boolean} [scrollLoad] 是否开启滚动到底部加载更多
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import merge from 'lodash/merge';

// import ContentLoader, { Facebook } from 'react-content-loader';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '@actions/posts';
import { getPostsListByListId } from '@reducers/posts';
import { isMember } from '@reducers/user';

// 依赖组件
import Pagination from '@components/pagination';
// import Loading from '@components/ui/loading';
import FullLoading from '@components/ui/full-loading';

import ItemRich from './components/item-rich';
import ItemPoor from './components/item-poor';
import NewTips from './components/new-tips';


// styles
import './index.scss';

@connect(
  (state, props) => ({
    isMember: isMember(state),
    postsList: getPostsListByListId(state, props.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
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
    itemType: 'rich',
    // 是否显示翻页
    showPagination: false,
    // 滚动底部加载更多
    scrollLoad: false,
    // 是否显示tips
    showTips: false
  }

  constructor(props) {
    super(props);
    this.loadDate = this.loadDate.bind(this);
  }

  componentDidMount() {
    const { id, postsList, scrollLoad } = this.props;
    if (!postsList.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  componentWillReceiveProps(props) {

    if (this.props.id != props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }
  }

  loadDate(restart = false) {
    const { id, filters, loadPostsList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    loadPostsList({ id, filters: _filters, restart });
  }

  render () {
    
    const { id, postsList, itemType, showPagination, showTips, isMember } = this.props;
    const { data, loading, more, count, filters = {} } = postsList;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center">没有数据</div>
    }

    return (<>
      
      {!loading && showTips && isMember ? <NewTips topicId={id} /> : null}

      {data && data.map(posts=>{
        if (itemType == 'poor') {
          return (<ItemPoor key={posts._id} posts={posts} />)
        } else {
          return (<ItemRich key={posts._id} posts={posts} />)
        }
      })}
      
      {loading ? <FullLoading /> : null}

      {showPagination &&
        <Pagination
          count={count || 0}
          pageSize={filters.page_size || 0}
          pageNumber={filters.page_number || 0}
        />
      }

    </>)
  }

}
