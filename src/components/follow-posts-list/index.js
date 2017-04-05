import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'

import arriveFooter from '../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadFollowPosts } from '../../actions/follow-people'
import { getPeopleListByName } from '../../reducers/follow-people'

import PostsItem from '../posts-item'
import ListLoading from '../list-loading'

export class FollowPeopleList extends Component{

  constructor(props) {
    super(props)

    const { name, filters, type } = this.props

    this.state = {
      name: name,
      filters: filters,
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
    const { loadFollowPosts } = this.props
    const { name, filters, type } = this.state

    loadFollowPosts({
      name: name,
      filters: filters,
      callback: (err, result) => {
        console.log(err);
        console.log(result);
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
            <PostsItem posts={people.posts_id} />
          </div>)
      })}

      <ListLoading loading={loading} more={more} handleLoad={this.triggerLoad} />
    </div>)

  }

}

FollowPeopleList.propTypes = {
  loadFollowPosts: PropTypes.func.isRequired,
  peopleList: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    peopleList: getPeopleListByName(state, props.name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadFollowPosts: bindActionCreators(loadFollowPosts, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowPeopleList)
