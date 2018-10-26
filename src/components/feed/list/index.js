import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadFeedList } from '../../../actions/feed';
import { getFeedListByName } from '../../../reducers/feed';

// 依赖组件
import PostsItem from '../../posts/posts-item';
import CommentItem from '../../feed/list-comment-item';
// import PostsItemTitle from '../../posts/posts-item-title';
// import ListLoading from '../../list-loading';
import Pagination from '../../pagination';
import Loading from '../../ui/loading';

// styles
import CSSModules from 'react-css-modules';
import styles from './style.scss'

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
@withRouter
@connect(
  (state, props) => ({
    list: getFeedListByName(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadFeedList, dispatch)
  })
)
@CSSModules(styles)
export default class PostsList extends Component {

  static defaultProps = {
    // 显示项
    itemName: 'posts-item',
    // 是否显示翻页
    showPagination: false,
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

    const { list, loadList, id, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);

    // this.state.positionY = getTop(this.refs['posts-list']) - 60;


    /*
    $(this.refs['posts-list']).find('> div').map((item, e)=>{
      console.log($(e).offset().top);
    });
    */

    /*
    this.refs['posts-list'].children.map(item=>{
      console.log(item);
      console.log();
    })
    */



    /*
    $(document).scroll(function() {
      console.log($(document).scrollTop() + $(window).height());
    });
    */
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

    const { id, list, itemName, showPagination, scrollLoad } = this.props;
    const { data, loading, more, count, filters = {} } = list;
    const { positionY } = this.state;

    // console.log(list);

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center mt-4 md-4">没有查询到结果</div>
    }

    console.log(list);

    //  ref="posts-list"
    return (<div>

      <div>
        {data && data.map(item=>{
          if (item.posts_id) {
            return (<PostsItem key={item._id} posts={item.posts_id} />)
          } else if (item.comment_id) {
            return (<CommentItem key={item._id} comment={item.comment_id} />)
          }
          // if (itemName == 'posts-item') {
            // return (<PostsItem key={posts._id} posts={posts} />)
          // }
          // else if (itemName == 'posts-item-title') {
            // return (<PostsItemTitle key={posts._id} posts={posts} />)
          // }
        })}
      </div>

      {/* <ListLoading loading={loading} /> */}
      {loading ? <Loading /> : null}

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
