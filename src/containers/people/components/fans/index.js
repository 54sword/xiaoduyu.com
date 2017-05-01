import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
// import PeopleList from '../../../../components/people-list'
import FollowPeopleList from '../../../../components/follow-people-list'

import { loadPeopleById } from '../../../../actions/people'
import { loadFans } from '../../../../actions/follow-people'

export class PeopleFans extends React.Component {

  // 服务器预加载内容
  static loadData({ store, props }, callback) {

    const { id } = props.params
    const { dispatch } = store

    dispatch(loadPeopleById({
      id,
      callback:(people)=>{
        if (!people) {
          callback(404)
          return
        }
        dispatch(loadFans({ name:'fans-'+id, filters:{ people_id: id }, callback:()=>{
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
        <FollowPeopleList name={people._id} filters={{ people_id: people._id }} type={"fans"} />
      </div>
    )

  }

}

export default Shell(PeopleFans)
