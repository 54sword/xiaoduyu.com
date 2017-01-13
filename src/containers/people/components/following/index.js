import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import PeopleList from '../../../../components/people-list'

import { loadPeopleById, loadFollowPeoples } from '../../../../actions/people'

class PeopleFollowing extends React.Component {

  // 服务器预加载内容
  static loadData(option, callback) {

    const { id } = option.props.params
    const { dispatch } = option.store

    dispatch(loadPeopleById({
      id,
      callback:(people)=>{
        if (!people) {
          callback('not found')
          return;
        }
        dispatch(loadFollowPeoples({ name:'follow-people-' + id, filters:{ user_id: id }, callback:()=>{
          callback()
        }}))
      }
    }))

  }

  constructor(props) {
    super(props)
  }

  render() {

    const { people } = this.props

    return (
      <div>
        <PeopleList name={people._id} filters={{ user_id: people._id }} type={"follow-people"} />
      </div>
    )

  }

}

export default Shell(PeopleFollowing)
