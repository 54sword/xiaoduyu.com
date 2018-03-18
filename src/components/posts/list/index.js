import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPostsList } from '../../../actions/posts';
import { getPostsListByName } from '../../../reducers/posts';

// 依赖组件
import PostsItem from '../../posts/posts-item';
import PostsItemTitle from '../../posts/posts-item-title';
import ListLoading from '../../list-loading';
import Pagination from '../../pagination';


/*
//获取元素的纵坐标
function getTop(e) {
  var offset = e.offsetTop;
  if (e.offsetParent!=null) offset += getTop(e.offsetParent);
  return offset;
}
*/

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
    postsList: getPostsListByName(state, props.id)
  }),
  dispatch => ({
    loadPostsList: bindActionCreators(loadPostsList, dispatch)
  })
)
@withRouter
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
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      // positionY: 0
    }
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {
    const { postsList, loadPostsList, id, scrollLoad } = this.props;
    if (!postsList.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);

    // this.state.positionY = getTop(this.refs['posts-list']) - 60;
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
    const { id, filters, loadPostsList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    await loadPostsList({ id, filters: _filters, restart });
  }

  render () {

    const { id, postsList, itemName, showPagination, scrollLoad } = this.props;
    const { data, loading, more, count, filters = {} } = postsList;
    const { positionY } = this.state

    return (<div>

      <div ref="posts-list">
        {data && data.map(posts=>{
          if (itemName == 'posts-item') {
            return (<PostsItem key={posts._id} posts={posts} />)
          } else if (itemName == 'posts-item-title') {
            return (<PostsItemTitle key={posts._id} posts={posts} />)
          }
        })}
      </div>

      {scrollLoad ? <ListLoading loading={loading} /> : null}

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
