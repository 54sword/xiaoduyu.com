import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import FollowPostsList from '../../../../components/follow-posts-list'

import { loadPeopleById } from '../../../../actions/people'
import { loadFollowPosts } from '../../../../actions/follow-people'

export class FollowPosts extends React.Component {

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

        dispatch(loadFollowPosts({
          name: people._id,
          filters: { user_id: people._id, posts_exsits: 1 },
          callback: (err, result) => {
            callback()
          }
        }))

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
        <FollowPostsList name={people._id} filters={{ user_id: people._id, posts_exsits: 1 }} type={"fans"} />
      </div>
    )

  }

}

export default Shell(FollowPosts)
