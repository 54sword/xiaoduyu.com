import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// 依赖的外部功能
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPostsList } from '../../../actions/posts';
import { getPostsListByName } from '../../../reducers/posts';

// 依赖组件
import PostsItem from '../../posts/posts-item';
import PostsItemTitle from '../../posts/posts-item-title';
import ListLoading from '../../list-loading';
import Pagination from '../../pagination';

import CSSModules from 'react-css-modules';
import styles from './style.scss';



@connect(
  (state, props) => ({
    postsList: getPostsListByName(state, props.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
@withRouter
// @CSSModules(styles)
export default class PostsList extends Component {

  static defaultProps = {
    // 显示项
    itemName: 'posts-item',
    // 是否显示翻页
    showPagination: true,
    // 滚动底部加载更多
    scrollLoad: false
  }

  static propTypes = {
    // 列表名称
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {
    const { postsList, loadPostsList, id, scrollLoad } = this.props;
    if (!postsList.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }

  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  async loadDate() {
    const { id, filters, loadPostsList } = this.props;
    await loadPostsList({ id, filters });
  }

  componentWillReceiveProps(props) {
    if (props.id != this.props.id) {
      const { loadPostsList } = this.props
      loadPostsList({ id: props.id, filters: props.filters, restart: true })
    }
  }

  render () {

    const { postsList, location, itemName, showPagination } = this.props
    const { data, loading, more, count, filters = {} } = postsList

    return (<div>

      <div>
        {data && data.map(posts=>{
          if (itemName == 'posts-item') {
            return (<PostsItem key={posts._id} posts={posts} />)
          } else if (itemName == 'posts-item-title') {
            return (<PostsItemTitle key={posts._id} posts={posts} />)
          }
        })}
      </div>

      <ListLoading loading={loading} />

      {showPagination ?
        <Pagination
          location={location}
          count={count || 0}
          pageSize={filters.page_size || 0}
          pageNumber={filters.page_number || 0}
        />: null}

    </div>)
  }

}
