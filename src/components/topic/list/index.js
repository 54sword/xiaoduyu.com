import React, { Component } from 'react'
import PropTypes from 'prop-types'

import connectReudx from '../../../common/connect-redux'

import { loadTopics } from '../../../store/actions/topic'
import { getTopicListByName } from '../../../store/reducers/topic'

import TopicItem from '../list-item'
import ListLoading from '../../list-loading'
import Pagination from '../../pagination'

export class TopicList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired,

    loadTopics: PropTypes.func.isRequired,
    topicList: PropTypes.object.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, props.name)
    }
  }
  static mapDispatchToProps = { loadTopics }

  constructor(props) {
    super(props)
    this.state = {}
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    const self = this
    const { name, topicList } = this.props

    if (!topicList.data) {
      self.triggerLoad()
    }

    // ArriveFooter.add(name, ()=>{
    //   self.triggerLoad()
    // })

  }

  componentWillUnmount() {
    const { name } = this.props
    // ArriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props

      const { name, filters, loadTopics } = props

      loadTopics({
        name,
        filters,
        restart: true
      })

    }
  }

  _triggerLoad(callback = ()=>{}) {
    const { name, filters, loadTopics } = this.props

    loadTopics({
      name,
      filters,
      callback
    })

  }

  render () {

    const { topicList, location } = this.props
    const { data, loading, more, count, filters = {} } = topicList

    return (<div>

      <ul className="list-group">
        {data && data.map((topic, index) => {
          return(<li key={topic._id} className="list-group-item">
            <TopicItem topic={topic} />
          </li>)
        })}
      </ul>

      <ListLoading loading={loading} />

      <Pagination
        location={location}
        count={count || 0}
        pageSize={filters.page_size || 0}
        pageNumber={filters.page_number || 0}
        />

    </div>)
  }

}

export default connectReudx(TopicList)
