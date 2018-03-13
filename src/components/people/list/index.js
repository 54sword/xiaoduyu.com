import React, { Component } from 'react'
import PropTypes from 'prop-types'

import connectReudx from '../../../common/connect-redux'
import { loadPeopleList } from '../../../actions/people'
import { getPeopleListByName } from '../../../reducers/people'

import PeopleItem from '../list-item'
import ListLoading from '../../list-loading'
import Pagination from '../../pagination'

export class PeopleList extends Component{

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired,

    loadPeopleList: PropTypes.func.isRequired,
    peopleList: PropTypes.object.isRequired
  }

  static mapStateToProps = (state, props) => {
    return {
      peopleList: getPeopleListByName(state, props.name)
    }
  }

  static mapDispatchToProps = { loadPeopleList }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    const { peopleList } = this.props
    if (!peopleList.data) this.load()
    // ArriveFooter.add(name, this.load)
  }

  componentWillUnmount() {
    const { name, type } = this.props
    // ArriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props
      const { name, filters, loadPeopleList } = props
      loadPeopleList({ name, filters, restart: true })
    }
  }

  load(callback) {
    const { name, filters, loadPeopleList } = this.props
    loadPeopleList({ name: name, filters: filters })
  }

  render () {

    const { peopleList, location } = this.props
    const { data, loading, more, count, filters = {} } = peopleList

    return (<div>

      <div className="list-group">
        {data && data.map(people=>{
          return (<PeopleItem people={people} key={people._id} />)
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

  }

}

export default connectReudx(PeopleList)
