
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

// 依赖的外部功能
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadSessionList } from '@actions/session';
import { getSessionListById } from '@reducers/session';

// 依赖组件
import Pagination from '@components/pagination';
import Loading from '@components/ui/full-loading';

import Item from './components/list-item';

// styles
import './index.scss';

@connect(
  (state, props) => ({
    list: getSessionListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadSessionList, dispatch)
  })
)
export default class MessageList extends Component {

  static propTypes = {
    // 列表id
    id: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    // 是否显示翻页
    showPagination: false,
    // 滚动底部加载更多
    scrollLoad: false,

    nothingTips: '没有数据了'
  }

  constructor(props) {
    super(props);
    this.loadDate = this.loadDate.bind(this);
  }

  componentDidMount() {
    const { id, list, scrollLoad } = this.props;
    if (!list.data) this.loadDate();
    if (scrollLoad) ArriveFooter.add(id, this.loadDate);
  }
  
  componentWillUnmount() {
    const { id, scrollLoad } = this.props;
    if (scrollLoad) ArriveFooter.remove(id);
  }

  // componentWillReceiveProps(props) {
    // if (this.props.id != props.id) {
    //   this.componentWillUnmount();
    //   this.props = props;
    //   this.componentDidMount();
    // }
  // }

  loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));

    loadList({ id, filters: _filters, restart });    
  }

  render () {
    
    const { id, list, showPagination, scrollLoad, nothingTips } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return (
        <div className="card-body text-center text-secondary">
          {nothingTips}
        </div>)
    }

    return (<>
      
      <div className="rounded">
        <div className="list-group list-group-flush">
          {data && data.map(item=>{
            return (<Item key={item._id} message={item} />)
          })}
        </div>
      </div>

      {loading ? <Loading /> : null}

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
