import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadFollowPeoples, loadFans } from '../../actions/follow-people'
import { getPeopleListByName } from '../../reducers/follow-people'

import PeopleItem from '../people-item'
import ListLoading from '../list-loading'

class PeopleList extends Component{

  constructor(props) {
    super(props)

    const { name, filters, type } = this.props

    this.state = {
      name: name,
      filters: filters,
      type: type // 关注 follow-people 或 粉丝 fans
    }

    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    const self = this
    const { peopleList } = this.props
    const { name, type } = this.state

    if (!peopleList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(type+'-'+name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    const { name, type } = this.state
    arriveFooter.remove(type+'-'+name)
  }

  _triggerLoad(callback) {
    const { loadFollowPeoples, loadFans } = this.props
    const { name, filters, type } = this.state

    const handle = type == 'follow-people' ? loadFollowPeoples : loadFans

    handle({
      name: type + '-' + name,
      filters: filters,
      callback: (err, callback) => {
      }
    })

  }

  render () {

    let { peopleList, type } = this.props

    if (!peopleList.data) {
      return (<div></div>)
    }

    const { data, loading, more } = peopleList

    return (<div className="container">
      {data.map(people=>{
        return (<div key={people._id}>
            <PeopleItem people={type == 'fans' ? people.user_id : people.people_id} />
          </div>)
      })}

      <ListLoading loading={loading} more={more} handleLoad={this.triggerLoad} />
    </div>)

  }

}

PeopleList.propTypes = {
  loadFollowPeoples: PropTypes.func.isRequired,
  loadFans: PropTypes.func.isRequired,
  peopleList: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    peopleList: getPeopleListByName(state, props.type + '-' +props.name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadFollowPeoples: bindActionCreators(loadFollowPeoples, dispatch),
    loadFans: bindActionCreators(loadFans, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleList)
