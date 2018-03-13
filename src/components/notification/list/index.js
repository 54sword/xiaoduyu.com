import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import connectReudx from '../../../common/connect-redux'
import { loadBroadcastList, updateBroadcast } from '../../../actions/broadcast'
import { getBroadcastListByName } from '../../../reducers/broadcast'

import ListLoading from '../../list-loading'
import Pagination from '../../pagination'


export class NotificationList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired,

    notification: PropTypes.object.isRequired,
    loadBroadcastList: PropTypes.func.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      notification: getBroadcastListByName(state, props.name)
    }
  }

  static mapDispatchToProps = { loadBroadcastList, updateBroadcast }

  constructor(props) {
    super(props)
    this.handleLoad = this.handleLoad.bind(this)
    this.updateBroadcast = this.updateBroadcast.bind(this)
  }

  componentDidMount() {
    const { notification } = this.props
    if (!notification.data) this.handleLoad()
    // ArriveFooter.add('notification', this.handleLoad)
  }

  componentWillUnmount() {
    // ArriveFooter.remove('index')
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadBroadcastList } = this.props
      loadBroadcastList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  updateBroadcast(id, data) {
    const { updateBroadcast } = this.props
    data._id = id
    updateBroadcast(data)
  }

  handleLoad() {
    const { name, filters, loadBroadcastList } = this.props
    loadBroadcastList({ name, filters })
  }

  render() {

    const { notification, location } = this.props
    const { data, loading, more, count, filters = {} } = notification

    return (<div>
      <div className="list-group">
        {data && data.map(item=>{
          return (<div className="list-group-item" key={item._id}>
            <div className="row">
              <div className="col-sm-2">
                <Link to={`/people/${item.sender_id._id}`}>{item.sender_id.nickname}</Link>
              </div>
              <div className="col-sm-1">{item._create_at}</div>
              <div className="col-sm-4">{item.type} - 广播人数{item.addressee_id.length} </div>
              <div className="col-sm-3">{item.type == 'new-comment' ? <Link to={`/comments?_id=${item.target}`}>{item.target}</Link> : ''}</div>
              <div className="col-sm-2">
                <a
                  className="btn btn-light btn-sm mb-2 mr-2"
                  href="javascript:void(0)" onClick={()=>{ this.updateBroadcast(item._id, { deleted: item.deleted ? false : true }) }}>
                  {item.deleted ? '已删除' : '删除'}
                </a>
              </div>
            </div>
          </div>)
        })}
      </div>

      <ListLoading loading={loading} />

      <Pagination
        location={location}
        count={count || 0}
        pageSize={filters.page_size || 0}
        pageNumber={filters.page_number || 0}
        />

    </div>)

    return (<div>
        <table styleName="table">
          <tbody>
          {notification.data.map(item=>{

            let backgroundColor = '#fff'

            if (item.deleted) {
              backgroundColor = '#ffe3e3'
            }

            return (<tr key={item._id} style={{backgroundColor}}>
              <td>{item.sender_id.nickname}</td>
              <td>{item.type}</td>
              <td>{item._create_at}</td>
              <td>
                {item.type == 'new-comment' ? <Link to={`/comments?_id=${item.target}`}>{item.target}</Link> : ''}
              </td>
              <td>通知人数:{item.addressee_id ? item.addressee_id.length : 0}</td>
              <td>
                <a href="javascript:void(0)" onClick={()=>{ this.updateBroadcast(item._id, { deleted: item.deleted ? false : true }) }}>
                  {item.deleted ? '已删除' : '删除'}
                </a>
              </td>
            </tr>)
          })}
        </tbody>
        </table>
      </div>
    )
  }
}

NotificationList = CSSModules(NotificationList, styles)

export default connectReudx(NotificationList)
