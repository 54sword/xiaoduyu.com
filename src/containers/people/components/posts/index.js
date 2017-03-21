import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

import Shell from '../../../../shell'
import PostsList from '../../../../components/posts-list'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPeopleById } from '../../../../actions/people'
import { loadPostsList } from '../../../../actions/posts'

export class PeoplePosts extends React.Component {

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

        dispatch(loadPostsList({name:id, filters:{user_id: id}, callback:()=>{
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
        <PostsList name={people._id} filters={{ user_id: people._id }} />
      </div>
    )

  }

}

export default Shell(PeoplePosts)
