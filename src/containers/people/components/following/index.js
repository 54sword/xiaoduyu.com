import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
// import PeopleList from '../../../../components/people-list'
import FollowPeopleList from '../../../../components/follow-people-list'

import { loadPeopleById, loadFollowPeoples } from '../../../../actions/people'

export class PeopleFollowing extends React.Component {

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
        dispatch(loadFollowPeoples({ name:'follow-people-' + id, filters:{ user_id: id, people_exsits: 1 }, callback:()=>{
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
        <FollowPeopleList name={people._id} filters={{ user_id: people._id, people_exsits: 1 }} type={"follow-people"} />
      </div>
    )

  }

}

export default Shell(PeopleFollowing)
