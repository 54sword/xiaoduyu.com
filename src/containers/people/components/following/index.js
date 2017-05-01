import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import FollowPeopleList from '../../../../components/follow-people-list'

import { loadPeopleById } from '../../../../actions/people'
import { loadFollowPeoples, loadFans } from '../../../../actions/follow-people'

export class PeopleFollowing extends React.Component {

  // 服务器预加载内容
  static loadData({ store, props }, callback) {

    const { id } = props.params
    const { dispatch } = store

    dispatch(loadPeopleById({
      id,
      callback:(people)=>{
        if (!people) {
          callback(404)
          return;
        }
        dispatch(loadFollowPeoples({ name:'follow-people-' + people._id, filters:{ user_id: people._id, people_exsits: 1 }, callback:()=>{
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
