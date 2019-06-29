import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

// redux
import { bindActionCreators } from 'redux';
import { connect, useSelector, useStore } from 'react-redux';
import { loadNotifications } from '@actions/notification';
import { getNotificationListById } from '@reducers/notification';

// components
import Loading from '@components/ui/loading';
// import HTMLText from '@components/html-text';
// import Pagination from '@components/pagination';
import Item from './components/item';

// style
import './index.scss';

// class
import ListClass from '../../../../class/list';

interface Props {
  // 列表id
  id: string;
  // 查询条件
  query: object;
  // 启动滚动加载
  scrollLoad?: boolean;
  // 显示分页
  showPagination?: boolean;
  //
  nothing?: string;
}

export default function(props: Props) {

  const { id } = props;

  const store = useStore();

  const list = useSelector((state: any) => getNotificationListById(state, id));
  
  return (<ListClass
    {...props}
    {...list}
    load={params=>loadNotifications(params)(store.dispatch, store.getState)}
    renderItem={(item: any)=>{
      return <Item notification={item} key={item._id} />
    }}
  />)

}

/*
@withRouter
@connect(
  (state, props) => ({
    notification: getNotificationListById(state, props.name)
  }),
  dispatch => ({
    loadNotifications: bindActionCreators(loadNotifications, dispatch)
  })
)
export default class NotificationList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  static defaultProps = {
    nothingTips: '没有更多数据'
  }

  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
  }

  componentDidMount() {
    const { notification } = this.props
    if (!notification.data) this.handleLoad()
    ArriveFooter.add(this.props.name, this.handleLoad)
  }

  componentWillUnmount() {
    ArriveFooter.remove(this.props.name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadNotifications } = this.props
      loadNotifications({ name: props.name, filters: props.filters, restart: true })
    }
  }

  handleLoad() {
    const { name, filters, loadNotifications } = this.props
    loadNotifications({ name, filters })
  }
  
  render() {

    const { notification, nothingTips } = this.props
    const { data, loading, more, count, filters = {} } = notification

    // 没有结果
    if (!loading && data && data.length == 0 && !more) {
      return (<div className="card">
        <div className="card-body text-center text-secondary">
          {nothingTips}
        </div>
      </div>)
    }

    return (<div className="card">
        <div className="card-body p-0">

          <div className="list-group" styleName="list">
            {data && data.map(notification => {
              return (<Item notification={notification} key={notification._id} />)
            })}
          </div>

          {loading ? <Loading /> : null}

      </div>
    </div>)

  }
}
*/