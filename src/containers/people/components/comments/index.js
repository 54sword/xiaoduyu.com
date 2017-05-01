import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPeopleById } from '../../../../actions/people'
import { loadCommentList } from '../../../../actions/comment'
import CommentList from '../../../../components/comment-list'

export class PeoplePosts extends React.Component {

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

        dispatch(loadCommentList({ name:id, filters:{ user_id: id, parent_exists: 0, sortBy: 'create_at', sort: -1 }, callback:()=>{
          callback()
        } }))
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
        <CommentList name={people._id} filters={{ user_id: people._id, parent_exists: 0, sortBy: 'create_at', sort: -1 }} />
      </div>
    )

  }

}

export default Shell(PeoplePosts)
