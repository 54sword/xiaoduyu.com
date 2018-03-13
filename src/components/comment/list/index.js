import React, { Component } from 'react'
import PropTypes from 'prop-types'

import connectReudx from '../../../common/connect-redux'
import { getCommentListByName } from '../../../reducers/comment'
import { loadCommentList } from '../../../actions/comment'

import ListLoading from '../../list-loading'
import CommentItem from '../list-item'
import Pagination from '../../pagination'

export class CommentList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired
  }

  static mapStateToProps = (state, props) => {
    // const name = props.name
    const { name } = props
    return {
      list: getCommentListByName(state, name)
    }
  }

  static mapDispatchToProps = { loadCommentList }

  constructor(props) {
    super(props)
    this.state = {}
    this.loadList = this.loadList.bind(this)
  }

  componentDidMount() {
    const { list } = this.props
    if (!list.data || list.data.length == 0) this.loadList()
    // ArriveFooter.add(this.state.name, this.loadList)
  }

  componentWillUnmount() {
    // ArriveFooter.remove(this.state.name)
  }

  loadList(callback) {
    const { name, filters, loadCommentList } = this.props
    loadCommentList({ name, filters: filters })
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadCommentList } = this.props
      loadCommentList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  render () {

    const { list, location } = this.props
    const { data, loading, more, filters = {}, count } = list

    return (
      <div>

        <div className="list-group">
          {data && data.map((comment)=>{
            return (<CommentItem comment={comment} key={comment._id} />)
          })}
        </div>

        <ListLoading loading={loading} />

        <Pagination
          location={location}
          count={count || 0}
          pageSize={filters.page_size || 0}
          pageNumber={filters.page_number || 0}
          />

      </div>
    )
  }
}

export default connectReudx(CommentList)
