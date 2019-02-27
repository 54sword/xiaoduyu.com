
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
import { loadMessageList } from '@actions/message';
import { getMessageListById } from '@reducers/message';

// 依赖组件
import Pagination from '@components/pagination';
import Loading from '@components/ui/content-loading';
import Item from './components/list-item';

// styles
import './index.scss';

@connect(
  (state, props) => ({
    list: getMessageListById(state, props.id)
  }),
  dispatch => ({
    loadList: bindActionCreators(loadMessageList, dispatch)
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
    // 是否显示tips
    showTips: false
  }

  constructor(props) {
    super(props);
    this.loadDate = this.loadDate.bind(this);
  }

  async componentDidMount() {

    const { list } = this.props;

    if (!list.data) await this.loadDate();

    setTimeout(()=>{
      window.scrollTo(0, $(document).height());
    }, 500);
  }

  componentWillReceiveProps(props) {

    if (this.props.id != props.id) {
      this.componentWillUnmount();
      this.props = props;
      this.componentDidMount();
    }

  }
  
  loadDate(restart = false) {
    const { id, filters, loadList } = this.props;
    let _filters = JSON.parse(JSON.stringify(filters));
    return loadList({ id, filters: _filters, restart });
  }

  render () {
    
    const { list } = this.props;
    const { data, loading, more = true, count, filters = {} } = list;

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center mb-2">没有数据</div>
    }
    
    return (<>

      {more ? <div styleName="more">
          <a href="javascript:void(0)" onClick={()=> { this.loadDate(); }}>加载更多</a>
        </div>
        : null}

      <div styleName="list">
        {data && data.map(item=>{
          return (<Item key={item._id} message={item} />)
        })}
      </div>

      {loading ? <Loading /> : null}

    </>)
  }

}
