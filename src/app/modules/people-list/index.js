import React, { Component } from 'react'
import PropTypes from 'prop-types'


// redux
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadPeopleList } from '@actions/people'
import { getPeopleListById } from '@reducers/people'

// components
import PeopleItem from '@modules/people-list/components/list-item';
// import ListLoading from '@components/list-loading';
import Loading from '@components/ui/full-loading';
// import Pagination from '../../pagination'


@connect(
  (state, props) => ({
    peopleList: getPeopleListById(state, props.name)
  }),
  dispatch => ({
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  })
)
export default class PeopleList extends Component{

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.load = this.load.bind(this)
  }

  componentDidMount() {
    const { name, peopleList } = this.props
    if (!peopleList.data) this.load();
    ArriveFooter.add(name, this.load);
  }

  componentWillUnmount() {
    const { name } = this.props;
    ArriveFooter.remove(name);
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

    const { peopleList } = this.props;
    const { data, loading, more, count, filters = {} } = peopleList;

    if (!loading && data && data.length == 0 && !more) {
      return <div className="text-center mt-4 md-4">没有查询到结果</div>
    }

    return (<div>

      <div className="list-group">
        {data && data.map(people=>{
          return (<PeopleItem people={people} key={people._id} />)
        })}
      </div>

      {loading ? <Loading /> : null}

      {/* <ListLoading loading={loading} /> */}

      {/*
      <Pagination
        location={location}
        count={count || 0}
        pageSize={filters.page_size || 0}
        pageNumber={filters.page_number || 0}
        />
      */}

    </div>)

  }

}