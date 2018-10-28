import React, { Component } from 'react'

import { updatePeople } from '../../../store/actions/people'
import connectRedux from '../../../common/connect-redux'

class PeopleActions extends Component {

  static mapDispatchToProps = { updatePeople }

  constructor(props) {
    super(props)
    this.updatePeople = this.updatePeople.bind(this)
  }

  updatePeople(e, data) {
    const { people, updatePeople } = this.props
    data._id = people._id
    updatePeople(data)
  }

  render () {

    const { people } = this.props
    const updatePeople = (data) => e => this.updatePeople(e, data)

    let time = new Date(people.banned_to_post).getTime() - new Date().getTime()
    if (time > 0) {
      time = parseInt(time / (1000 * 60))
    } else if (time < 0) {
      time = 0
    }

    return ([
        <a
          className="btn btn-light btn-sm mb-2 mr-2"
          href="javascript:void(0)"
          key="1"
          onClick={updatePeople({
            banned_to_post: (time ? new Date() : new Date(new Date().getTime() + 1000*60*60*24*3))+''
          })}>
          {time ? '已禁言 ' + time + '分钟' : '禁言'}
        </a>,
        <a
          className="btn btn-light btn-sm mb-2 mr-2"
          key="2"
          href="javascript:void(0)"
          onClick={updatePeople({ blocked: people.blocked ? false : true })}>{people.blocked ? '已拉黑' : '拉黑'}</a>
    ])


  }

}

export default connectRedux(PeopleActions)
